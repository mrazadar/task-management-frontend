import { Metadata } from 'next'
import Link from 'next/link'
// Dynamic metadata for SEO
export const metadata: Metadata = {
  title: 'Task Manager - View All Tasks',
  description: 'Manage your tasks efficiently with AI-powered suggestions.',
  keywords: ['task manager', 'productivity', 'AI tasks'],
}

// Server component for task list
export default async function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Task Manager</h1>
      <div className="flex gap-4">
        <Link
          className="mb-4 text-blue-600 visited:text-purple-600 hover:underline"
          href="/tasks/new"
        >
          Create a new task
        </Link>
        <Link
          className="mb-4 text-blue-600 visited:text-purple-600 hover:underline"
          href="/tasks"
        >
          View all tasks
        </Link>
      </div>
    </main>
  )
}

/**
 * @description Next.js server component for rendering the task list page with SEO metadata.
 * @reference https://nextjs.org/docs/app/building-your-application/rendering/server-components
 * @reference https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 * @reference https://ui.shadcn.com/docs/components/button
 * @linting ESLint with Airbnb TypeScript rules ensures code consistency.
 */
