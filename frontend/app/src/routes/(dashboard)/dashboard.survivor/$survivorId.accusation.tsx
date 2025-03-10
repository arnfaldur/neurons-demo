import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/dashboard/survivor/$survivorId/accusation',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/(dashboard)/dashboard/survivor/$survivorId/accusation"!</div>
  )
}
