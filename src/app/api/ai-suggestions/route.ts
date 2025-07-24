import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Task } from '@/types/task'

// Mock AI prioritization function
function mockPrioritizeTasks(tasks: Task[]): string {
  // Simple mock: prioritize tasks by description length (longest first)
  const prioritized = tasks
    .sort((a, b) => (b.description?.length || 0) - (a.description?.length || 0))
    .map((task, index) => `${index + 1}. ${task.title}`)
  return `Suggested task order:\n${prioritized.join('\n')}`
}
// http://msdn.microsoft.com/en-us/library/ee476510.aspx$
export async function POST(request: Request) {
  try {
    // Verify JWT cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tasks } = await request.json()

    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Tasks must be an array' },
        { status: 400 },
      )
    }

    // Generate mock AI suggestions
    const suggestions = mockPrioritizeTasks(tasks)
    return NextResponse.json({ suggestions })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch AI suggestions' + JSON.stringify(error) },
      { status: 500 },
    )
  }
}

// import { NextResponse } from 'next/server'
// import { cookies } from 'next/headers'
// import { type Task } from '@/types/task'

// /**
//  * Mock prioritize tasks function.
//  * Prioritize tasks by status "Todo" and "In Progress" first, then "Done".
//  * In_Progress tasks are prioritized before Todo tasks.
//  * @param tasks The tasks to prioritize
//  */
// function mockPrioritizeTasks(tasks: Task[]): string {
//   const prioritized = tasks.toSorted((a, b) => {
//     if (a.status === 'IN_PROGRESS' && b.status !== 'IN_PROGRESS') {
//       return -1
//     } else if (a.status !== 'IN_PROGRESS' && b.status === 'IN_PROGRESS') {
//       return 1
//     } else if (a.status === 'TODO' && b.status !== 'TODO') {
//       return -1
//     } else if (a.status === 'TODO' && b.status === 'TODO') {
//       return -1
//     }
//     return -1
//   })
//   return `Suggested task order: \n${prioritized.map((task, index) => `${index + 1}. ${task.title}`).join('\n')}`
// }

// export async function GET(request: Request) {
//   try {
//     const cookieStore = await cookies()
//     const token = cookieStore.get('token')?.value

//     if (!token) {
//       return NextResponse.json({ error: 'No token found' }, { status: 401 })
//     }

//     const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/tasks`
//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Cookie: `token=${token}`,
//       },
//       cache: 'no-store',
//     })

//     if (!response.ok) {
//       if (response.status === 401) {
//         return NextResponse.redirect(new URL('/auth/SignIn', request.url))
//       }
//       throw new Error('Failed to fetch tasks')
//     }

//     const data = await response.json()
//     // Handle both possible task field names
//     const tasks: Task[] = Array.isArray(data) ? data : []

//     if (tasks.length === 0) {
//       return NextResponse.json({ error: 'No tasks found' }, { status: 404 })
//     }

//     return NextResponse.json(mockPrioritizeTasks(tasks))
//   } catch (error) {
//     console.error('Error fetching tasks:', error)
//     NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
//   }
// }
