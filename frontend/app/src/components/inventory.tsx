import {
	Typography,
	Stack,
	Chip,
	Tooltip,
	Grid2,
	Divider,
	Box,
	Paper,
} from "@mui/material";
import { red, green, blue, amber, lightGreen } from "@mui/material/colors";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import InventoryIcon from "@mui/icons-material/Inventory";

import { Survivor } from "../types";

// A compact component to display inventory items with icons
export function InventorySmall({
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

export const InventoryBig = ({ survivor }: { survivor: Survivor }) => (
	<Grid2 size={{ xs: 12 }}>
		<Divider sx={{ my: 1 }} />
		<Box sx={{ display: "flex", alignItems: "center" }}>
			<InventoryIcon sx={{ mr: 1 }} />
			<Typography variant="subtitle1">Inventory</Typography>
		</Box>

		<Grid2 container spacing={2} sx={{ mt: 1 }}>
			<Grid2 size={{ xs: 6, sm: 3 }}>
				<Paper sx={{ p: 1, textAlign: "center", bgcolor: blue[100] }}>
					<Typography variant="subtitle2">Water</Typography>
					<Typography>
						{survivor.inventory?.water || 0}{" "}
						<LocalDrinkIcon fontSize="small" />
					</Typography>
				</Paper>
			</Grid2>
			<Grid2 size={{ xs: 6, sm: 3 }}>
				<Paper sx={{ p: 1, textAlign: "center", bgcolor: green[100] }}>
					<Typography variant="subtitle2">Food</Typography>
					<Typography>
						{survivor.inventory?.food || 0}{" "}
						<RestaurantIcon fontSize="small" />
					</Typography>
				</Paper>
			</Grid2>
			<Grid2 size={{ xs: 6, sm: 3 }}>
				<Paper sx={{ p: 1, textAlign: "center", bgcolor: red[100] }}>
					<Typography variant="subtitle2">Medication</Typography>
					<Typography>
						{survivor.inventory?.medication || 0}{" "}
						<MedicalServicesIcon fontSize="small" />
					</Typography>
				</Paper>
			</Grid2>
			<Grid2 size={{ xs: 6, sm: 3 }}>
				<Paper sx={{ p: 1, textAlign: "center", bgcolor: amber[100] }}>
					<Typography variant="subtitle2">Ammunition</Typography>
					<Typography>
						{survivor.inventory?.ammunition || 0}{" "}
						<InventoryIcon fontSize="small" />
					</Typography>
				</Paper>
			</Grid2>
		</Grid2>
	</Grid2>
);
