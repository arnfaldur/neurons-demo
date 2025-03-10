import { useActionState, useContext, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Grid2,
	Typography,
	Divider,
	Box,
	Paper,
	Button,
	Input,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { API_BASE_URL } from "../../../../utils";
import { Survivor } from "../../-types";
import { SurvivorPickerDialog } from "./SurvivorPickerDialog";
import { LocationSection } from "../../../register-survivor/-components/LocationSection";
import {
	NotificationContext,
	NotificationState,
} from "../../../-Notifications";

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

async function submit(
	_: NotificationState,
	formData: FormData,
): Promise<NotificationState> {
	// create the last_location object from formData
	const last_location = [formData.get("latitude"), formData.get("longitude")].map(Number);
	const survivorId = formData.get("id");

	try {
		const response = await fetch(
			`${API_BASE_URL}/survivors/${survivorId}/location`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(last_location),
			},
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.detail || "Failed to update location");
		}

		return {
			success: "Survivor location updated successfully!",
		};
	} catch (error) {
		return {
			error:
				error instanceof Error
					? error.message
					: "Unknown error occurred",
		};
	}
}

const Location = ({ survivor }: { survivor: Survivor }) => {
	const queryClient = useQueryClient();
	const [state, formAction] = useActionState(submit, null);
	const setNotification = useContext(NotificationContext);
	useEffect(() => {
		setNotification(state);
		if (state && "success" in state) {
			// It would be better to make this more fine grained
			// This approach likely doesn't work well with the getAll
			// design of the /survivors endpoint. But it's there to avoid
			// the N+1 problem, so there are tradeoffs.
			queryClient.invalidateQueries({
				queryKey: ["survivors"],
			});
			queryClient.invalidateQueries({
				queryKey: ["survivors", survivor.id],
			});
		}
	}, [state]);
	return (
		<Grid2 size={{ xs: 12 }}>
			<Divider sx={{ my: 1 }} />
			<Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
				<LocationOnIcon sx={{ mr: 1 }} />
				<Typography variant="subtitle1">Last Known Location</Typography>
			</Box>
			<form action={formAction}>
				<Grid2 container spacing={3} sx={{ alignItems: "center" }}>
					<LocationSection last_location={survivor.last_location} />
					<Grid2 size={{ xs: 12, sm: 4 }}>
						<Input type="hidden" name="id" value={survivor.id} />
						<Button
							type="submit"
							size="large"
							variant="outlined"
							color="primary"
						>
							Update
						</Button>
					</Grid2>
				</Grid2>
			</form>
		</Grid2>
	);
};

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
