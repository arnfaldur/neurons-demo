import { createFileRoute, Outlet } from "@tanstack/react-router";

import { SurvivorDetailsDialog } from "./-components/SurvivorDetailsDialog";

export const Route = createFileRoute(
	"/(dashboard)/survivors/$survivorId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { survivorId } = Route.useParams();
	return (
		<>
			<SurvivorDetailsDialog survivorId={survivorId} />
			<Outlet />
		</>
	);
}
