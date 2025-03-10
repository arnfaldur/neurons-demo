import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { SurvivorsTable } from "./-components/SurvivorsTable";
import { API_BASE_URL } from "../../utils";

export const Route = createFileRoute("/(dashboard)/survivors")({
	component: Survivors,
});

function Survivors() {
	const { data: survivors } = useQuery({
		queryKey: ["survivors"],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/survivors`);
			const survivorList = await response.json();
			return Object.fromEntries(survivorList.map((s) => [s.id, s]));
		},
	});

	return (
		<>
			{/* Survivors Table */}
			<SurvivorsTable
				survivors={(survivors && Object.values(survivors)) ?? []}
			/>
			<Outlet />
		</>
	);
}
