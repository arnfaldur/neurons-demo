import { useState } from "react";
import { Grid2, TextField, Typography } from "@mui/material";

type InventoryItem = "water" | "food" | "medication" | "ammunition";

function InventoryItemField({ item }: { item: InventoryItem }) {
	const [value, setValue] = useState(0);

	// Format the label (capitalize first letter)
	const label = item.charAt(0).toUpperCase() + item.slice(1);

	return (
		<Grid2 size={{ xs: 6, sm: 3 }}>
			<TextField
				fullWidth
				label={label}
				name={`inventory.${item}`}
				type="number"
				slotProps={{ htmlInput: { min: 0 } }}
				value={value}
				onChange={(e) => setValue(Number(e.target.value))}
			/>
		</Grid2>
	);
}

export function InventorySection() {
	const inventoryItems: InventoryItem[] = [
		"water",
		"food",
		"medication",
		"ammunition",
	];

	return (
		<>
			<Grid2 size={{ xs: 12 }}>
				<Typography variant="h6">Inventory</Typography>
			</Grid2>

			{inventoryItems.map((item) => (
				<InventoryItemField key={item} item={item} />
			))}
		</>
	);
}
