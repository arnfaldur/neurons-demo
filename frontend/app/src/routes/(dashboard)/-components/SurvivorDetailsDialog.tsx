import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Grid2 as Grid2,
	Typography,
	Divider,
	Box,
	Paper,
	Button,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { API_BASE_URL } from "../../../utils";
import { Survivor } from "../-types";
import { Link } from "@tanstack/react-router";

export function SurvivorDetailsDialog({ survivorId }: { survivorId: number }) {
	const queryClient = useQueryClient();
	const {
		data: survivor,
		isFetching,
		isFetched,
	} = useQuery({
		queryKey: ["survivor", survivorId],
		queryFn: async () => {
			const response = await fetch(
				`${API_BASE_URL}/survivors/${survivorId}`,
			);
			return await response.json();
		},
	});
	const deleteSurvivor = async (survivorId: number) => {
		await fetch(`${API_BASE_URL}/survivors/${survivorId}`, {
			method: "DELETE",
		});
		queryClient.invalidateQueries({ queryKey: ["survivors"] });
		queryClient.invalidateQueries({ queryKey: ["survivor", survivorId] });
	};
	return (
		<Dialog open={true} maxWidth="sm" fullWidth>
			<DialogTitle>
				{isFetching ? "Loading survivor" : "Survivor Details"}
			</DialogTitle>
			<DialogContent>
				{isFetched && (
					<Grid2 container spacing={2}>
						<Bio survivor={survivor} />
						<Location survivor={survivor} />
						<Inventory survivor={survivor} />
					</Grid2>
				)}
			</DialogContent>
			<DialogActions>
				<Link to="/dashboard">
					<Button
						onClick={() => deleteSurvivor(survivorId)}
						variant="contained"
						color="error"
					>
						Delete
					</Button>
				</Link>
				<Link to="/dashboard">
					<Button variant="contained" color="primary">
						Close
					</Button>
				</Link>
			</DialogActions>
		</Dialog>
	);
}

const Bio = ({ survivor }: { survivor: Survivor }) => (
	<>
		<Grid2 size={{ xs: 12, sm: 3 }}>
			<Typography variant="subtitle2">Name</Typography>
			{survivor.name}
		</Grid2>
		<Grid2 size={{ xs: 12, sm: 3 }}>
			<Typography variant="subtitle2">Age</Typography>
			{survivor.age}
		</Grid2>
		<Grid2 size={{ xs: 12, sm: 3 }}>
			<Typography variant="subtitle2">Gender</Typography>
			{survivor.gender}
		</Grid2>
	</>
);

const Location = ({ survivor }: { survivor: Survivor }) => (
	<Grid2 size={{ xs: 12 }}>
		<Divider sx={{ my: 1 }} />
		<Box sx={{ display: "flex", alignItems: "center" }}>
			<LocationOnIcon sx={{ mr: 1 }} />
			<Typography variant="subtitle1">Last Known Location</Typography>
		</Box>
		X: {survivor.last_location[0]}, Y: {survivor.last_location[1]}
	</Grid2>
);

const Inventory = ({ survivor }: { survivor: Survivor }) => (
	<Grid2 size={{ xs: 12 }}>
		<Divider sx={{ my: 1 }} />
		<Box sx={{ display: "flex", alignItems: "center" }}>
			<InventoryIcon sx={{ mr: 1 }} />
			<Typography variant="subtitle1">Inventory</Typography>
		</Box>

		<Grid2 container spacing={2} sx={{ mt: 1 }}>
			<Grid2 size={{ xs: 6, sm: 3 }}>
				<Paper sx={{ p: 1, textAlign: "center" }}>
					<Typography variant="subtitle2">Water</Typography>

					{survivor.inventory?.water || 0}
				</Paper>
			</Grid2>
			<Grid2 size={{ xs: 6, sm: 3 }}>
				<Paper sx={{ p: 1, textAlign: "center" }}>
					<Typography variant="subtitle2">Food</Typography>

					{survivor.inventory?.food || 0}
				</Paper>
			</Grid2>
			<Grid2 size={{ xs: 6, sm: 3 }}>
				<Paper sx={{ p: 1, textAlign: "center" }}>
					<Typography variant="subtitle2">Medication</Typography>

					{survivor.inventory?.medication || 0}
				</Paper>
			</Grid2>
			<Grid2 size={{ xs: 6, sm: 3 }}>
				<Paper sx={{ p: 1, textAlign: "center" }}>
					<Typography variant="subtitle2">Ammunition</Typography>

					{survivor.inventory?.ammunition || 0}
				</Paper>
			</Grid2>
		</Grid2>
	</Grid2>
);
