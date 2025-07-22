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
