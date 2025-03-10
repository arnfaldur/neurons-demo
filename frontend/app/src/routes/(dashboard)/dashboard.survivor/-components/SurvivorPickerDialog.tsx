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

import { API_BASE_URL } from "../../../../utils";
import type { Survivor } from "../../../../types";

// This component lets you pick a survivor to accuse another of being infected.
export function SurvivorPickerDialog({ open, accusations, setSurvivorPicker }) {
	const { survivorId } = useParams({ strict: false });
	const queryClient = useQueryClient();
	const { data: survivors } = useQuery({
		queryKey: ["survivors"],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/survivors`);
			const survivorList = await response.json();
			return Object.fromEntries(survivorList.map((s) => [s.id, s]));
		},
	});

	const chooseAccuser = async (accuser_id: number | null) => {
		setSurvivorPicker(false);
		if (!accuser_id) return;
		await fetch(`${API_BASE_URL}/survivors/${survivorId}/infection`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ accuser_id }),
		});
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
								key={survivor.id}
								onClick={() => chooseAccuser(survivor.id)}
								hover
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
