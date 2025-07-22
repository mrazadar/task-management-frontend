'use client'
import { Button } from '@/components/ui/button'

// Client component for refresh button
export function RefreshButton() {
  const handleRefresh = () => {
    window.location.reload() // Simple refresh for demo
  }

  return (
    <Button onClick={handleRefresh} className="mb-4">
      Refresh Tasks
    </Button>
  )
}

export default RefreshButton
