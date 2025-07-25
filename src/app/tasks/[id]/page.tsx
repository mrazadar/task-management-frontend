import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Task } from '@/types/task'
import TaskCard from '@/components/TaskCard'
import { notFound } from 'next/navigation'
import { ApiResponse } from '@/types'

// Fetch single task server-side
async function fetchTask(id: string): Promise<ApiResponse<Task>> {
  const cookieStore = await cookies() // Await async cookies
  const token = cookieStore.get('token')?.value

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/tasks/${id}`,
    {
      cache: 'no-store', // SSR
      headers: token ? { Cookie: `token=${token}` } : {},
    },
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Task not found')
    }
    throw new Error('Failed to fetch task')
  }
  return response.json()
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  try {
    const { id: task_id } = await params
    const resp = await fetchTask(task_id)
    let task: Task | null = null
    if (resp.success) {
      task = resp.data as Task
    }
    return {
      title: `Task Manager - ${task?.title}`,
      description: `View details for task: ${task?.title}`,
    }
  } catch {
    return {
      title: 'Task Manager - Task Not Found',
      description: 'Task details not available',
    }
  }
}

export default async function TaskPage({ params }: { params: { id: string } }) {
  let task: Task | null = null
  let error: string | null = null

  try {
    const { id: task_id } = await params
    const resp = await fetchTask(task_id)
    if (resp.success) {
      task = resp.data as Task
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'Task not found') {
      notFound()
    }
    error = err instanceof Error ? err.message : 'Unknown error'
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Task Details</h1>
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        task && <TaskCard task={task} />
      )}
    </main>
  )
}

/**
 * @description Server component for rendering a single task with async cookie-based auth.
 * @reference https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 * @reference https://nextjs.org/docs/app/api-reference/functions/cookies
 * @linting ESLint with Airbnb TypeScript rules ensures code consistency.
 */
