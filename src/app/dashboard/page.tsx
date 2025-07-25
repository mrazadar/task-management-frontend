import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Task } from '@/types/task'
import { Link } from 'lucide-react'
import { cookies } from 'next/headers'

export default async function Dashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) {
    return (
      <div>
        <p>No token found</p>
        <Link
          className="mb-4 text-blue-600 visited:text-purple-600 hover:underline"
          href="/auth/SignIn"
        >
          SignIn
        </Link>
      </div>
    )
  }
  const initialTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Short',
      status: 'TODO',
      createdAt: '2023-03-01T00:00:00.000Z',
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Short Task Description',
      status: 'TODO',
      createdAt: '2023-03-02T00:00:00.000Z',
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Long Task Description. Long Task Description.',
      status: 'IN_PROGRESS',
      createdAt: '2023-03-03T00:00:00.000Z',
    },
  ]

  const response = await fetch(`http:localhost:3000/api/ai-suggestions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `token=${token}`,
    },
    body: JSON.stringify({ tasks: initialTasks }),
  })
  const { suggestions } = await response.json()

  console.log('Suggestions:', suggestions)

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <h6 className="mb-6 text-2xl font-bold">Dashboard</h6>
      <section className="w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Tasks</h2>
        {initialTasks.map((task, index) => (
          <div key={`${task.id}-${index}`} className="rounded-md border p-4">
            <h3 className="font-medium">{task.title}</h3>
            <p className="text-sm">{task.description}</p>
            <div className="flex justify-between">
              <span className="text-sm">Status: {task.status}</span>
              <span className="text-sm">Created: {task.createdAt}</span>
            </div>
          </div>
        ))}
        <h2 className="text-lg font-semibold">AI Suggestions</h2>
        <pre className="text-sm whitespace-pre-wrap">
          {suggestions || 'No suggestions available'}
        </pre>
        <form action="/api/ai-suggestions" method="POST" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-task">Add New Task</Label>
            <Input id="new-task" placeholder="Enter new task" />
          </div>
          <Button type="submit">Get AI Suggestions</Button>
        </form>
      </section>
    </div>
  )
}
