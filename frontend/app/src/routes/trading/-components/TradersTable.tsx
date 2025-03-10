import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Stack,
	Chip,
	Tooltip,
} from "@mui/material";
import { Survivor } from "../../../types";
import { red, green, blue, amber, lightGreen } from "@mui/material/colors";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import InventoryIcon from "@mui/icons-material/Inventory";

const THead = () => (
	<TableHead>
		<TableRow>
			<TableCell>ID</TableCell>
			<TableCell>Name</TableCell>
			<TableCell>Inventory</TableCell>
		</TableRow>
	</TableHead>
);

// A compact component to display inventory items with icons
function InventoryDisplay({
	inventory,
}: {
	inventory?: {
		water: number;
		food: number;
		medication: number;
		ammunition: number;
	};
}) {
	if (!inventory)
		return <Typography variant="body2">No inventory</Typography>;

	return (
		<Stack useFlexGap direction="row" spacing={0.5} flexWrap="wrap">
			<Tooltip title="Water">
				<Chip
					size="small"
					icon={<LocalDrinkIcon fontSize="small" />}
					label={inventory.water}
					sx={{ bgcolor: blue[100] }}
				/>
			</Tooltip>
			<Tooltip title="Food">
				<Chip
					size="small"
					icon={<RestaurantIcon fontSize="small" />}
					label={inventory.food}
					sx={{ bgcolor: green[100] }}
				/>
			</Tooltip>
			<Tooltip title="Medication">
				<Chip
					size="small"
					icon={<MedicalServicesIcon fontSize="small" />}
					label={inventory.medication}
					sx={{ bgcolor: red[100] }}
				/>
			</Tooltip>
			<Tooltip title="Ammunition">
				<Chip
					size="small"
					icon={<InventoryIcon fontSize="small" />}
					label={inventory.ammunition}
					sx={{ bgcolor: amber[100] }}
				/>
			</Tooltip>
		</Stack>
	);
}

export function TradersTable({
	survivors,
	select,
	selected,
	forbidden,
}: {
	survivors: Survivor[];
	select: (s: number | null) => void;
	selected: number | null;
	forbidden: number | null;
}) {
	return (
		<>
			<TableContainer component={Paper} sx={{ mb: 1 }}>
				<Table>
					<THead />
					<TableBody>
						{Object.values(survivors)
							.filter(
								(survivor) =>
									(!selected || selected === survivor.id) &&
									survivor.id !== forbidden,
							)
							.map((survivor) => (
								<TableRow
									key={survivor.id}
									hover
									sx={
										selected === survivor.id
											? {
													background: lightGreen[400],
											  }
											: {}
									}
									onClick={() => select(survivor.id)}
								>
									<TableCell>{survivor.id}</TableCell>
									<TableCell>{survivor.name}</TableCell>
									<TableCell>
										<InventoryDisplay
											inventory={survivor.inventory}
										/>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			{selected && (
				<Button
					variant="contained"
					color="warning"
					onClick={() => select(null)}
				>
					Reset selection
				</Button>
			)}
		</>
	);
}
