import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Task } from '@/types/task'
import { Suspense } from 'react'
import TaskCard from '@/components/TaskCard'
import { ApiResponse } from '@/types'
import Link from 'next/link'

// Fetch tasks server-side
async function fetchTasks(): Promise<ApiResponse> {
  const cookieStore = await cookies() // Await async cookies
  const token = cookieStore.get('token')?.value

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/tasks?page=1&limit=100`,
    {
      cache: 'no-store', // SSR
      headers: token ? { Cookie: `token=${token}` } : {},
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }
  return response.json()
}

export const metadata: Metadata = {
  title: 'Task Manager - View All Tasks',
  description: 'Manage your tasks efficiently with AI-powered suggestions.',
}

export default async function Home() {
  let initialTasks: Task[] = []
  let error: string | null = null

  try {
    const resp: ApiResponse = await fetchTasks()
    if (resp.success) {
      initialTasks = Array.isArray(resp.data) ? resp.data : []
    } else {
      error = resp.message || 'Failed to load tasks'
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error'
  }

  //   useEffect(() => {
  //   const eventSource = new EventSource('/api/tasks/stream');
  //   eventSource.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.event === 'heartbeat') return;

  //     const message = (() => {
  //       switch (data.event) {
  //         case 'taskCreated':
  //           return `New task "${data.task.title}" created`;
  //         case 'taskUpdated':
  //           return `Task "${data.task.title}" updated to ${data.task.status}`;
  //         case 'taskDeleted':
  //           return `Task deleted`;
  //         default:
  //           return 'Task updated';
  //       }
  //     })();

  //     toast({
  //       title: 'Task Update',
  //       description: message,
  //       duration: 3000,
  //     });
  //     handleFetchTasks(page); // Refresh tasks
  //   };

  //   eventSource.onerror = () => {
  //     setError('Error receiving real-time updates');
  //     eventSource.close();
  //   };

  //   return () => eventSource.close();
  // }, [page]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Task Manager</h1>
      <Suspense fallback={<p>Loading tasks...</p>}>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {initialTasks.map((task: Task) => (
              <Link href={`/tasks/${task.id}`} key={task.id}>
                <TaskCard task={task} />
              </Link>
            ))}
          </div>
        )}
      </Suspense>
    </main>
  )
}

/**
 * @description Server component for initial task list rendering with SSR and async cookie-based auth.
 * @reference https://nextjs.org/docs/app/building-your-application/rendering/server-components
 * @reference https://nextjs.org/docs/app/api-reference/functions/cookies
 * @linting ESLint with Airbnb TypeScript rules ensures code consistency.
 */
