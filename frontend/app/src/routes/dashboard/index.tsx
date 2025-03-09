import { createFileRoute } from "@tanstack/react-router";
import { Box, Typography } from "@mui/material";

export const Route = createFileRoute("/dashboard/")({
	component: Dashboard,
});

function Dashboard() {
	return (
		<Box>
			<Typography variant="h4" component="h1" gutterBottom>
				Survivors Dashboard
			</Typography>
		</Box>
	);
}
