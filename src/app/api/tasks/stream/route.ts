import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const sendEvent = (data: {
        event: string
        task: {
          userId: number
          title: string
          description: string
          status: string
        }
      }) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      // Forward backend SSE stream
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/tasks/stream`, {
        method: 'GET',
        headers: { cookie: `token=${token}` },
      })
        .then((response) => {
          const reader = response.body?.getReader()
          if (!reader) {
            controller.close()
            return
          }

          const pump = async () => {
            const { done, value } = await reader.read()
            if (done) {
              controller.close()
              return
            }
            controller.enqueue(value)
            pump()
          }
          pump()
        })
        .catch((error) => {
          controller.error(error)
        })
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
