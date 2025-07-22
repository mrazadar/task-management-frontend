import { Metadata } from 'next'
import { Task } from '@/types/task'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function fetchTask(id: string): Promise<Task> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/tasks/${id}`,
    {
      cache: 'no-store',
    },
  )
  if (!response.ok) {
    throw new Error('Task not found')
  }
  return response.json()
}

interface TaskPageProps {
  params: { id: string }
}

export async function generateMetadata({
  params,
}: TaskPageProps): Promise<Metadata> {
  const task = await fetchTask(params.id)
  return {
    title: `Task: ${task.title}`,
    description: task.description || 'View details of your task.',
  }
}

export default async function TaskPage({ params }: TaskPageProps) {
  const task = await fetchTask(params.id)

  return (
    <main className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {task.description || 'No description'}
          </p>
          <p className="text-sm font-semibold">Status: {task.status}</p>
          <p className="text-xs text-gray-500">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

/**
 * @description Server component for rendering a single task page with dynamic SEO metadata.
 * @reference https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 * @reference https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
