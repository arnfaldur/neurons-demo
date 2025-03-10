import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Chip,
	Tooltip,
	Box,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { cyan } from "@mui/material/colors";

import type { Survivor } from "../../../types";

// All the table components had to be turned into a div so that the rows can be Link components
// It's an ugly workaround, but the alternative didn't seem better
// It could be implemented in javascript but then we loose <a> tag features.
// I don't know if there are any features enabled by proper table element usage,
// that we are loosing by doing this.

// Component to display location coordinates nicely
function LocationDisplay({ coordinates }: { coordinates: [number, number] }) {
	// Format coordinates to 4 decimal places max
	const formatCoord = (num: number) => {
		return parseFloat(num.toFixed(4)).toString();
	};

	const [lat, lng] = coordinates;

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
			<LocationOnIcon fontSize="small" color="action" />
			<Tooltip title={`Latitude: ${lat}, Longitude: ${lng}`}>
				<Chip
					size="small"
					label={`${formatCoord(lat)}, ${formatCoord(lng)}`}
					sx={{
						bgcolor: cyan[50],
						"& .MuiChip-label": { fontSize: "0.8rem" },
					}}
				/>
			</Tooltip>
		</Box>
	);
}

const THead = () => (
	<TableHead component="div">
		<TableRow component="div">
			<TableCell component="div">ID</TableCell>
			<TableCell component="div">Name</TableCell>
			<TableCell component="div">Age</TableCell>
			<TableCell component="div">Gender</TableCell>
			<TableCell component="div">Location</TableCell>
		</TableRow>
	</TableHead>
);

const TBody = ({ survivors }: { survivors: Survivor[] }) => (
	<TableBody component="div">
		{survivors.map((survivor) => (
			<TableRow
				key={survivor.id}
				component={Link}
				to={`/dashboard/survivor/${survivor.id}`}
				hover
			>
				<TableCell component="div">{survivor.id}</TableCell>
				<TableCell component="div">{survivor.name}</TableCell>
				<TableCell component="div">{survivor.age}</TableCell>
				<TableCell component="div">{survivor.gender}</TableCell>
				<TableCell component="div">
					<LocationDisplay coordinates={survivor.last_location} />
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
				<Table component="div">
					<THead />
					<TBody survivors={survivors} />
				</Table>
			</TableContainer>
		</>
	);
}
