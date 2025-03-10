import { useState, useContext } from "react";
import { Link } from "@tanstack/react-router";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Grid2,
	Typography,
	Button,
	CircularProgress,
	Alert,
	Box,
} from "@mui/material";
import { NotificationContext } from "../../-Notifications";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { API_BASE_URL } from "../../../utils";
import type { Survivor } from "../../../types";
import { SurvivorPickerDialog } from "./SurvivorPickerDialog";
import { Location } from "./Location";
import { InventoryBig } from "../../../components/inventory";

// This component shows details about a survivor
export function SurvivorDetailsDialog({ survivorId }: { survivorId: number }) {
	const queryClient = useQueryClient();
	const setNotification = useContext(NotificationContext);
	
	const {
		data: survivor,
		isFetching,
		isFetched,
		error: survivorError,
		status: survivorStatus,
		refetch: refetchSurvivor
	} = useQuery({
		queryKey: ["survivors", survivorId],
		queryFn: async () => {
			try {
				const response = await fetch(
					`${API_BASE_URL}/survivors/${survivorId}`,
				);
				if (!response.ok) {
					throw new Error("Failed to fetch survivor data");
				}
				return await response.json();
			} catch (error) {
				// Notify user of connection error
				setNotification({ error: "Failed to load survivor data. Please check your connection." });
				throw error;
			}
		},
	});
	
	const { 
		data: accusations, 
		status: accusationsStatus, 
		error: accusationsError,
		refetch: refetchAccusations
	} = useQuery<Set<number>>({
		queryKey: ["survivors", survivorId, "infection", "accusers"],
		queryFn: async () => {
			try {
				const response = await fetch(
					`${API_BASE_URL}/survivors/${survivorId}/infection/accusers`,
				);
				if (!response.ok) {
					throw new Error("Failed to fetch accusations data");
				}
				// make set out of existing accusations, and add self to avoid accusing oneself.
				return new Set([...(await response.json()), Number(survivorId)]);
			} catch (error) {
				// Notify user of connection error
				setNotification({ error: "Failed to load accusations data. Please check your connection." });
				throw error;
			}
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
		<>
			<Dialog open={true} maxWidth="sm">
				<DialogTitle>
					{survivorStatus === "pending" ? "Loading survivor..." : "Survivor Details"}
				</DialogTitle>
				<DialogContent>
					{survivorStatus === "pending" && (
						<Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
							<CircularProgress />
						</Box>
					)}

					{survivorStatus === "error" && (
						<Alert 
							severity="error" 
							sx={{ my: 2 }}
							action={
								<Button color="inherit" size="small" onClick={() => refetchSurvivor()}>
									Retry
								</Button>
							}
						>
							Failed to load survivor data. Please check your connection.
						</Alert>
					)}

					{survivorStatus === "success" && (
						<Grid2 container spacing={2}>
							<Bio survivor={survivor} />
							<Location survivor={survivor} />
							<InventoryBig survivor={survivor} />
						</Grid2>
					)}
					
					{accusationsStatus === "error" && (
						<Alert 
							severity="warning" 
							sx={{ mt: 2 }}
							action={
								<Button color="inherit" size="small" onClick={() => refetchAccusations()}>
									Retry
								</Button>
							}
						>
							Failed to load accusations data.
						</Alert>
					)}
				</DialogContent>
				<DialogActions>
					<Grid2 container spacing={2}>
						<Grid2 size={4}>
							<Button
								onClick={() => setSurvivorPicker(true)}
								variant="contained"
								color="secondary"
								disabled={survivorStatus !== "success"}
							>
								Accuse
							</Button>
						</Grid2>
						<Grid2 size={4}>
							<Link to="/survivors">
								<Button
									onClick={() => deleteSurvivor(survivorId)}
									variant="contained"
									color="error"
								>
									Delete
								</Button>
							</Link>
						</Grid2>
						<Grid2 size={4}>
							<Link to="/survivors">
								<Button variant="contained" color="primary">
									Close
								</Button>
							</Link>
						</Grid2>
					</Grid2>
				</DialogActions>
			</Dialog>
			{accusationsStatus === "success" && (
				<SurvivorPickerDialog
					accusations={accusations}
					open={survivorPicker}
					setSurvivorPicker={setSurvivorPicker}
				/>
			)}
		</>
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
