import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Task } from '@/types/task'

interface TaskCardProps {
  task: Task
}

export const TaskCard = ({ task }: TaskCardProps) => {
  return (
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
  )
}

/**
 * @description Reusable server component for rendering a single task card.
 * @reference https://ui.shadcn.com/docs/components/card
 * @reference https://nextjs.org/docs/app/building-your-application/rendering/server-components
 * @linting ESLint with Airbnb TypeScript rules ensures code consistency.
 */

export default TaskCard
