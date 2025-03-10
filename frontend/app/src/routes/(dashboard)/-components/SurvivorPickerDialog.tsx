import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Paper,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

import { API_BASE_URL, easyPost } from "../../../utils";
import type { Survivor } from "../../../types";
import { useContext } from "react";
import { NotificationContext } from "../../-Notifications";

// This component lets you pick a survivor to accuse another of being infected.
export function SurvivorPickerDialog({
	open,
	accusations,
	setSurvivorPicker,
}: {
	open: boolean;
	accusations: Set<number>;
	setSurvivorPicker: (v: boolean) => void;
}) {
	const { survivorId } = useParams({ strict: false });
	const queryClient = useQueryClient();
	const { data: survivors } = useQuery({
		queryKey: ["survivors"],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/survivors`);
			const survivorList = await response.json();
			return Object.fromEntries(survivorList.map((s: Survivor) => [s.id, s]));
		},
	});
	const setNotification = useContext(NotificationContext);

	const chooseAccuser = async (accuser_id: number | null) => {
		setSurvivorPicker(false);
		if (!accuser_id) return;
		const result = await easyPost(
			`${API_BASE_URL}/survivors/${survivorId}/infection`,
			JSON.stringify({ accuser_id }),
			"Failed to accuse survivor of being infected",
			"Survivor flagged as infected",
		);
		setNotification(result);
		queryClient.invalidateQueries({
			queryKey: ["survivors", survivorId, "infection", "accusers"],
		});
		queryClient.invalidateQueries({
			queryKey: ["survivors", survivorId],
		});
		queryClient.invalidateQueries({
			queryKey: ["survivors"],
		});
	};

	// Filter out survivors that can't make an accusation
	const potentialAccusers = (
		(survivors && Object.values(survivors)) ??
		[]
	).filter((s) => !accusations.has(s.id));
	return (
		<Dialog open={open}>
			<DialogTitle>Choose the accusing survivor</DialogTitle>
			<DialogContent>
				<AccusersTable
					potentialAccusers={potentialAccusers}
					chooseAccuser={chooseAccuser}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => setSurvivorPicker(false)}
					variant="contained"
					color="primary"
				>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function AccusersTable({
	potentialAccusers,
	chooseAccuser,
}: {
	potentialAccusers: Survivor[];
	chooseAccuser: any;
}) {
	return (
		<>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Name</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{potentialAccusers.map((survivor) => (
							<TableRow
								hover
								key={survivor.id}
								onClick={() => chooseAccuser(survivor.id)}
								sx={{ cursor: "pointer" }}
							>
								<TableCell>{survivor.id}</TableCell>
								<TableCell>{survivor.name}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
