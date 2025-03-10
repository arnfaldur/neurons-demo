import { Grid2, Typography, Divider, Box, Paper } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";

import type { Survivor } from "../../../../types";

export const Inventory = ({ survivor }: { survivor: Survivor }) => (
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
