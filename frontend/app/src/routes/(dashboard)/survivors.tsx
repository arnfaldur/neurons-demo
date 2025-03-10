import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, CircularProgress, Button } from "@mui/material";

import { SurvivorsTable } from "./-components/SurvivorsTable";
import { API_BASE_URL } from "../../utils";
import { Survivor } from "../../types";

export const Route = createFileRoute("/(dashboard)/survivors")({
	component: Survivors,
});

function Survivors() {
	const { data: survivors, status, error, refetch } = useQuery({
		queryKey: ["survivors"],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/survivors`);
			const survivorList = await response.json();
			return Object.fromEntries(survivorList.map((s: Survivor) => [s.id, s]));
		},
	});

	if (status === "pending") {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
				<CircularProgress />
			</Box>
		);
	}
	
	if (status === "error") {
		return (
			<Box sx={{ textAlign: "center", my: 4, p: 3, border: "1px solid #f44336", borderRadius: 1 }}>
				<Typography color="error" variant="h6" gutterBottom>
					Connection Error
				</Typography>
				<Typography>
					Could not load survivors data.
				</Typography>
				<Button 
					variant="contained" 
					color="primary"
					sx={{ mt: 2 }}
					onClick={() => refetch()}
				>
					Retry
				</Button>
			</Box>
		);
	}

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
