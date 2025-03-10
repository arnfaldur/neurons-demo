import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { API_BASE_URL } from "../../utils";
import { TradersTable } from "./-components/TradersTable";
import { TradeInventorySection } from "./-components/TradingInventory";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid2,
	Typography,
	Box,
	Divider,
	Stack,
} from "@mui/material";
import { useMemo, useState } from "react";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

export const Route = createFileRoute("/trading/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: survivors, status: survivorsStatus } = useQuery({
		queryKey: ["survivors"],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/survivors`);
			const survivorList = await response.json();
			return Object.fromEntries(survivorList.map((s) => [s.id, s]));
		},
	});
	const [selectedA, setSelectedA] = useState<number | null>(null);
	const [selectedB, setSelectedB] = useState<number | null>(null);
	const [tradeBalance, setTradeBalance] = useState({
		a: { water: 0, food: 0, medication: 0, ammunition: 0 },
		b: { water: 0, food: 0, medication: 0, ammunition: 0 },
	});

	const survivorA = useMemo(
		() => selectedA && survivors?.[selectedA],
		[selectedA, survivors],
	);
	const survivorB = useMemo(
		() => selectedB && survivors?.[selectedB],
		[selectedB, survivors],
	);

	// Handle trade changes
	const handleTradeChangeA = (resourceType, value) => {
		setTradeBalance((prev) => ({
			...prev,
			a: { ...prev.a, [resourceType]: value },
		}));
	};

	const handleTradeChangeB = (resourceType, value) => {
		setTradeBalance((prev) => ({
			...prev,
			b: { ...prev.b, [resourceType]: value },
		}));
	};

	// Calculate if trade is balanced/fair
	const isTradeBalanced = useMemo(() => {
		// This is a placeholder - in a real app you'd implement actual trade balance logic
		return true;
	}, [tradeBalance]);

	if (survivorsStatus !== "success") return null;

	return (
		<>
			<Typography variant="h5" component="h2" gutterBottom>
				Trading menu
			</Typography>
			<Typography variant="subtitle1" component="h3" gutterBottom>
				Choose one survivor from each list
			</Typography>

			<Grid2 container spacing={{ xs: 2, sm: 2, md: 3 }}>
				<Grid2 size={{ xs: 12, sm: 6 }}>
					<TradersTable
						survivors={Object.values(survivors)}
						selected={selectedA}
						select={setSelectedA}
						forbidden={selectedB}
					/>
				</Grid2>
				<Grid2 size={{ xs: 12, sm: 6 }}>
					<TradersTable
						survivors={Object.values(survivors)}
						selected={selectedB}
						select={setSelectedB}
						forbidden={selectedA}
					/>
				</Grid2>
			</Grid2>
			{survivorA && survivorB && (
				<Dialog
					open={!!selectedA && !!selectedB}
					maxWidth="md"
					fullWidth
				>
					<DialogTitle>
						Trading between {survivorA.name} and {survivorB.name}
					</DialogTitle>
					<DialogContent>
						<Stack
							useFlexGap
							direction={{ xs: "column", md: "row" }}
							spacing={2}
							sx={{ width: "100%" }}
							divider={
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										py: 1,
									}}
								>
									<CompareArrowsIcon
										fontSize="large"
										color="action"
									/>
								</Box>
							}
						>
							<Box sx={{ flex: 1, width: "100%" }}>
								<TradeInventorySection
									survivor={survivorA}
									onTradeChange={handleTradeChangeA}
								/>
							</Box>
							<Box sx={{ flex: 1, width: "100%" }}>
								<TradeInventorySection
									survivor={survivorB}
									onTradeChange={handleTradeChangeB}
								/>
							</Box>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button
							variant="contained"
							color="warning"
							onClick={() => {
								setSelectedA(null);
								setSelectedB(null);
							}}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="primary"
							disabled={!isTradeBalanced}
						>
							Complete Trade
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</>
	);
}
