import { Metadata } from 'next'
import { Task } from '@/types/task'

import { Suspense } from 'react'

import { TaskCard } from '@/components/TaskCard'
import { RefreshButton } from '@/components/RefreshButton'
import Link from 'next/link'

async function fetchTasks(): Promise<Task[]> {
  try {
    const tasks = await fetch('http://localhost:3000/api/tasks')
    console.log('Tasks', tasks)
    return tasks.json()
  } catch (error) {
    console.error('Error fetching tasks', error)
    throw new Error('Error fetching tasks')
  }
}

// Dynamic metadata for SEO
export const metadata: Metadata = {
  title: 'Task Manager - View All Tasks',
  description: 'Manage your tasks efficiently with AI-powered suggestions.',
  keywords: ['task manager', 'productivity', 'AI tasks'],
}

// Server component for task list
export default async function Tasks() {
  let tasks: Task[] = []
  let error: string | null = null

  try {
    tasks = await fetchTasks()
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error'
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Task Manager</h1>
      <Suspense fallback={<p>Loading tasks...</p>}>
        <RefreshButton />
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <Link key={task.id} className="mb-4" href={`/tasks/${task.id}`}>
                <TaskCard task={task} />
              </Link>
            ))}
          </div>
        )}
      </Suspense>
    </div>
  )
}

/**
 * @description Next.js server component for rendering the task list page with SEO metadata.
 * @reference https://nextjs.org/docs/app/building-your-application/rendering/server-components
 * @reference https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 * @reference https://ui.shadcn.com/docs/components/button
 * @linting ESLint with Airbnb TypeScript rules ensures code consistency.
 */
