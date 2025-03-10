import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Grid2,
	Typography,
	Button,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { API_BASE_URL } from "../../../../utils";
import type { Survivor } from "../../../../types";
import { SurvivorPickerDialog } from "./SurvivorPickerDialog";
import { Inventory } from "./Inventory";
import { Location } from "./Location";

// This component shows details about a survivor
export function SurvivorDetailsDialog({ survivorId }: { survivorId: number }) {
	const queryClient = useQueryClient();
	const {
		data: survivor,
		isFetching,
		isFetched,
	} = useQuery({
		queryKey: ["survivors", survivorId],
		queryFn: async () => {
			const response = await fetch(
				`${API_BASE_URL}/survivors/${survivorId}`,
			);
			return await response.json();
		},
	});
	const { data: accusations, status: accusationsStatus } = useQuery({
		queryKey: ["survivors", survivorId, "infection", "accusers"],
		queryFn: async () => {
			const response = await fetch(
				`${API_BASE_URL}/survivors/${survivorId}/infection/accusers`,
			);
			// make set out of existing accusations, and add self to avoid accusing oneself.
			return new Set([...(await response.json()), Number(survivorId)]);
		},
	});
	const [survivorPicker, setSurvivorPicker] = useState(false);

	const deleteSurvivor = async (survivorId: number) => {
		await fetch(`${API_BASE_URL}/survivors/${survivorId}`, {
			method: "DELETE",
		});
		queryClient.invalidateQueries({ queryKey: ["survivors"] });
		queryClient.invalidateQueries({ queryKey: ["survivors", survivorId] });
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
				<Grid2 container spacing={2}>
					<Button
						onClick={() => setSurvivorPicker(true)}
						variant="contained"
						color="secondary"
					>
						Accuse
					</Button>
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
				</Grid2>
			</DialogActions>
			{accusationsStatus === "success" && (
				<SurvivorPickerDialog
					accusations={accusations}
					open={survivorPicker}
					setSurvivorPicker={setSurvivorPicker}
				/>
			)}
		</Dialog>
	);
}

const Bio = ({ survivor }: { survivor: Survivor }) => (
	<>
		<Grid2 size={{ xs: 12, sm: 5 }}>
			<Typography variant="subtitle2">Name</Typography>
			{survivor.name}
		</Grid2>
		<Grid2 size={{ xs: 5.5, sm: 3 }}>
			<Typography variant="subtitle2">Age</Typography>
			{survivor.age}
		</Grid2>
		<Grid2 size={{ xs: 6.5, sm: 4 }}>
			<Typography variant="subtitle2">Gender</Typography>
			{survivor.gender}
		</Grid2>
	</>
);
