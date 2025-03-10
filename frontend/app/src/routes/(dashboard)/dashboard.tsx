import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { SurvivorsTable } from "./-components/SurvivorsTable";
import { API_BASE_URL } from "../../utils";

export const Route = createFileRoute("/(dashboard)/dashboard")({
	component: Dashboard,
});

function Dashboard() {
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
			<Box>
				<Typography variant="h4" component="h1" gutterBottom>
					Survivors Dashboard
				</Typography>

				{/* Survivors Table */}
				<SurvivorsTable
					survivors={(survivors && Object.values(survivors)) ?? []}
				/>
			</Box>
			<Outlet />
		</>
	);
}
