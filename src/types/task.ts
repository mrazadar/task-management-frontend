import { z } from 'zod'

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'], {
    error: 'Invalid status',
  }),
})

export type CreateTask = z.infer<typeof CreateTaskSchema>

export interface Task {
  id: number
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  createdAt: string
}

/**
 * @description TypeScript interface for tasks fetched from the backend.
 * @reference Backend Task model in prisma/schema.prisma
 */
