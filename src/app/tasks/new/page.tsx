'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import useSWRMutation from 'swr/mutation'
import axios from 'axios'
import { CreateTask, CreateTaskSchema } from '@/types/task'

async function createTaskFetcher(url: string, { arg }: { arg: CreateTask }) {
  return axios.post(url, arg, { withCredentials: true }).then((res) => res.data)
}

export default function NewTaskPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { trigger, isMutating } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/tasks`,
    createTaskFetcher,
  )

  const form = useForm<CreateTask>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      // // dueDate: '',
      // category: { name: '', color: '' },
    },
  })

  const onSubmit = async (data: CreateTask) => {
    try {
      await trigger(data)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <main className="container mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">Create Task</h1>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Task title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Task description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TODO">TODO</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="Category name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category.color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Color</FormLabel>
                <FormControl>
                  <Input placeholder="#FF0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <Button type="submit" disabled={isMutating}>
            {isMutating ? 'Creating...' : 'Create Task'}
          </Button>
        </form>
      </Form>
    </main>
  )
}

/**
 * @description Client component for creating tasks with advanced Zod validation.
 * @reference https://swr.vercel.app/docs/mutation
 * @reference https://ui.shadcn.com/docs/components/form
 * @reference https://ui.shadcn.com/docs/components/select
 */
