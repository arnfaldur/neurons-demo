import { useState, useEffect } from "react";
import {
	Typography,
	Chip,
	Box,
	Slider,
	Stack,
	Paper,
	Divider,
} from "@mui/material";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import InventoryIcon from "@mui/icons-material/Inventory";
import { blue, green, red, amber } from "@mui/material/colors";
import type { Survivor } from "../../../types";

// Resource types with associated metadata
const resources = {
	water: {
		label: "Water",
		icon: <LocalDrinkIcon />,
		color: blue[100],
		sliderColor: blue[500],
	},
	food: {
		label: "Food",
		icon: <RestaurantIcon />,
		color: green[100],
		sliderColor: green[500],
	},
	medication: {
		label: "Medication",
		icon: <MedicalServicesIcon />,
		color: red[100],
		sliderColor: red[500],
	},
	ammunition: {
		label: "Ammunition",
		icon: <InventoryIcon />,
		color: amber[100],
		sliderColor: amber[500],
	},
};

// Type for resource keys
type ResourceKey = keyof typeof resources;

interface TradeInventorySectionProps {
	survivor: Survivor;
	onTradeChange?: (resourceType: ResourceKey, value: number) => void;
}

export function TradeInventorySection({
	survivor,
	onTradeChange,
}: TradeInventorySectionProps) {
	// Initialize trade amounts
	const [tradeAmounts, setTradeAmounts] = useState<
		Record<ResourceKey, number>
	>({
		water: 0,
		food: 0,
		medication: 0,
		ammunition: 0,
	});

	// Update parent component when trade amounts change
	useEffect(() => {
		// This would typically be used to update a parent state
		// or to calculate trade balance
	}, [tradeAmounts]);

	// Handle slider change for a resource
	const handleSliderChange = (resource: ResourceKey, newValue: number) => {
		setTradeAmounts((prev) => ({ ...prev, [resource]: newValue }));
		if (onTradeChange) {
			onTradeChange(resource, newValue);
		}
	};

	return (
		<Paper elevation={2} sx={{ py: 2, px: 3, width: "100%" }}>
			<Typography variant="h6" sx={{ mb: 2 }}>
				{survivor.name}'s Inventory
			</Typography>

			<Divider sx={{ mb: 2 }} />

			{Object.entries(resources).map(([key, resource]) => {
				const resourceKey = key as ResourceKey;
				const maxAmount = survivor.inventory?.[resourceKey] || 0;
				const currentAmount = tradeAmounts[resourceKey];

				return (
					<Box key={key} sx={{ mb: 2 }}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								mb: 1,
								width: "100%",
							}}
						>
							{/* Resource label with icon */}
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<Box
									sx={{ mr: 1, color: resource.sliderColor }}
								>
									{resource.icon}
								</Box>
								<Typography variant="body1">
									{resource.label}
								</Typography>
							</Box>

							{/* Chips container - right aligned */}
							<Stack
								direction="row"
								spacing={1}
								sx={{ justifyContent: "flex-end" }}
							>
								{/* Available amount */}
								<Chip
									size="small"
									label={`Available: ${maxAmount}`}
									sx={{ bgcolor: resource.color }}
								/>

								{/* Trading amount */}
								<Chip
									size="small"
									label={`Trading: ${currentAmount}`}
									color={
										currentAmount > 0
											? "primary"
											: "default"
									}
									variant={
										currentAmount > 0
											? "filled"
											: "outlined"
									}
								/>
							</Stack>
						</Box>

						{/* Slider for adjusting trade amount */}
						<Slider
							value={currentAmount}
							onChange={(_, newValue) =>
								handleSliderChange(
									resourceKey,
									newValue as number,
								)
							}
							min={0}
							max={maxAmount}
							step={1}
							marks={[
								{ value: 0, label: "0" },
								{
									value: maxAmount,
									label: maxAmount.toString(),
								},
							]}
							sx={{
								color: resource.sliderColor,
								"& .MuiSlider-thumb": {
									height: 24,
									width: 24,
								},
								"& .MuiSlider-valueLabel": {
									backgroundColor: resource.sliderColor,
								},
							}}
							valueLabelDisplay="auto"
						/>
					</Box>
				);
			})}
		</Paper>
	);
}
