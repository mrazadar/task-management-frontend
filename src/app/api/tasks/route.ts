import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (!token) {
    return new Response('No token found', { status: 401 })
  }

  console.log('Token:', token)
  console.log('Request:', request)
  console.log('Headers:', request.headers)

  // const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/tasks`
  // console.log('Fetching tasks from', url) // Debugging i)
  // try {
  //   const response = await fetch(url, { cache: 'no-store' })

  //   if (!response.ok) {
  //     console.log('Failed to fetch tasks', response.status)
  //     throw new Error('Failed to fetch tasks')
  //   }

  //   return response.json()
  // } catch (error) {
  //   console.error('Error fetching tasks:', error)
  //   throw new Error('Error fetching tasks')
  // }

  const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/tasks`
  console.log('Fetching tasks from', url) // Debugging i)
  try {
    const response = await fetch(url, { cache: 'no-store' })
    console.log('Response:', response)

    const resp = await response.json()
    console.log('Response from getTasks', resp)

    if (!resp.success) {
      console.log('Failed to fetch tasks', resp.success)
      throw new Error('Failed to fetch tasks')
    }

    return resp.data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw new Error('Error fetching tasks')
  }
}
