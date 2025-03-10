import { useActionState, useContext, useEffect } from "react";
import { Grid2, Typography, Divider, Box, Button, Input } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useQueryClient } from "@tanstack/react-query";

import { API_BASE_URL, easyPost } from "../../../utils";
import type { Survivor } from "../../../types";
import { LocationSection } from "../../register-survivor/-components/LocationSection";
import {
	NotificationContext,
	NotificationState,
} from "../../-Notifications";

async function submitLocationChange(
	_: NotificationState,
	formData: FormData,
): Promise<NotificationState> {
	// create the last_location object from formData
	const last_location = [
		formData.get("latitude"),
		formData.get("longitude"),
	].map(Number);
	const survivorId = formData.get("id");

	return await easyPost(
		`${API_BASE_URL}/survivors/${survivorId}/location`,
		JSON.stringify(last_location),
		"Failed to update location",
		"Survivor location updated successfully!",
	);
}

export const Location = ({ survivor }: { survivor: Survivor }) => {
	const queryClient = useQueryClient();
	const [submissionResult, formAction] = useActionState(
		submitLocationChange,
		null,
	);
	const setNotification = useContext(NotificationContext);
	useEffect(() => {
		setNotification(submissionResult);
		if (submissionResult && "success" in submissionResult) {
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
	}, [submissionResult]);
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
