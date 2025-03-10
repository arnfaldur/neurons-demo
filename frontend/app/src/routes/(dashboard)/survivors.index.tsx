import { createFileRoute } from '@tanstack/react-router'

// This is just here to show the dashboard layout without a modal
export const Route = createFileRoute('/(dashboard)/survivors/')({
  component: () => null,
})
