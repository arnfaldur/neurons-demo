import { createFileRoute } from "@tanstack/react-router";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { SurvivorsTable } from "./-components/SurvivorsTable";

const API_BASE_URL = "http://localhost:8000";

export const Route = createFileRoute("/dashboard/")({
	component: Dashboard,
});

function Dashboard() {
	const survivors = useQuery({
		queryKey: ["survivors"],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/survivors`);
			return await response.json();
		},
	});
	useEffect(() => {
		console.log({ survivors });
	}, [survivors]);
	return (
		<Box>
			<Typography variant="h4" component="h1" gutterBottom>
				Survivors Dashboard
			</Typography>

			{/* Survivors Table */}
			<SurvivorsTable survivors={survivors?.data ?? []} />
		</Box>
	);
}
