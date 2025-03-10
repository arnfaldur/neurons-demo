import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { Survivor } from "../-types";

const THead = () => (
	<TableHead>
		<TableRow>
			<TableCell>ID</TableCell>
			<TableCell>Name</TableCell>
			<TableCell>Age</TableCell>
			<TableCell>Gender</TableCell>
			<TableCell>Location</TableCell>
		</TableRow>
	</TableHead>
);

const TBody = ({ survivors }: { survivors: Survivor[] }) => (
	<TableBody>
		{survivors.map((survivor) => (
			<TableRow key={survivor.id}>
				<TableCell>{survivor.id}</TableCell>
				<TableCell>{survivor.name}</TableCell>
				<TableCell>{survivor.age}</TableCell>
				<TableCell>{survivor.gender}</TableCell>
				<TableCell>
					{`X: ${survivor.last_location[0]}, Y: ${survivor.last_location[1]}`}
				</TableCell>
			</TableRow>
		))}
	</TableBody>
);

export function SurvivorsTable({ survivors }: { survivors: Survivor[] }) {
	return (
		<>
			<Typography variant="h5" component="h2" gutterBottom>
				Survivors List
			</Typography>

			<TableContainer component={Paper}>
				<Table>
					<THead />
					<TBody survivors={survivors} />
				</Table>
			</TableContainer>
		</>
	);
}
