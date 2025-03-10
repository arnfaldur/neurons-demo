import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { API_BASE_URL, easyPost } from "../../utils";
import { TradersTable } from "./-components/TradersTable";
import { TradingInventory } from "./-components/TradingInventory";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid2,
	Typography,
	Box,
	Stack,
	CircularProgress,
} from "@mui/material";
import { useContext, useMemo, useState } from "react";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { inventoryPointValue } from "./-utils";
import { green } from "@mui/material/colors";
import { NotificationContext } from "../-Notifications";
import { Survivor } from "../../types";

export const Route = createFileRoute("/trading/")({
	component: TradingRoute,
});

const emptyInventory = {
	water: 0,
	food: 0,
	medication: 0,
	ammunition: 0,
};

function TradingRoute() {
	const queryClient = useQueryClient();
	const { data: survivors, status: survivorsStatus } = useQuery({
		queryKey: ["survivors"],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/survivors`);
			const survivorList = await response.json();
			return Object.fromEntries(
				survivorList.map((s: Survivor) => [s.id, s]),
			);
		},
	});
	const setNotification = useContext(NotificationContext);
	const [selectedA, setSelectedA] = useState<number | null>(null);
	const [selectedB, setSelectedB] = useState<number | null>(null);
	const [tradeBalanceA, setTradeBalanceA] = useState(emptyInventory);
	const [tradeBalanceB, setTradeBalanceB] = useState(emptyInventory);

	const survivorA = useMemo(
		() => selectedA && survivors?.[selectedA],
		[selectedA, survivors],
	);
	const survivorB = useMemo(
		() => selectedB && survivors?.[selectedB],
		[selectedB, survivors],
	);

	// Handle trade changes
	const handleTradeChangeA = (resourceType: string, value: number) => {
		setTradeBalanceA((prev) => ({
			...prev,
			[resourceType]: value,
		}));
	};

	const handleTradeChangeB = (resourceType: string, value: number) => {
		setTradeBalanceB((prev) => ({
			...prev,
			[resourceType]: value,
		}));
	};

	// Calculate if trade is balanced/fair
	const isTradeBalanced = useMemo(() => {
		return (
			inventoryPointValue(tradeBalanceA) > 0 &&
			inventoryPointValue(tradeBalanceA) ===
				inventoryPointValue(tradeBalanceB)
		);
	}, [tradeBalanceA, tradeBalanceB]);

	if (survivorsStatus === "pending") {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (survivorsStatus === "error") {
		return (
			<Box
				sx={{
					textAlign: "center",
					my: 4,
					p: 3,
					border: "1px solid #f44336",
					borderRadius: 1,
				}}
			>
				<Typography color="error" variant="h6" gutterBottom>
					Connection Error
				</Typography>
				<Typography>
					Could not load survivors data.
				</Typography>
				<Button
					variant="contained"
					color="primary"
					sx={{ mt: 2 }}
					onClick={() => window.location.reload()}
				>
					Retry
				</Button>
			</Box>
		);
	}

	const performTrade = async () => {
		const offer = {
			trader_id: selectedB,
			offered: tradeBalanceB,
			requested: tradeBalanceA,
		};
		const result = await easyPost(
			`${API_BASE_URL}/survivors/${selectedA}/trade`,
			JSON.stringify(offer),
			"Failed to complete trade",
			"Trade completed successfully!",
		);
		setNotification(result);
		queryClient.invalidateQueries({
			queryKey: ["survivors"],
		});
		queryClient.invalidateQueries({
			queryKey: ["survivors", selectedA],
		});
		queryClient.invalidateQueries({
			queryKey: ["survivors", selectedB],
		});
	};

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
					{survivors && (
						<TradersTable
							survivors={survivors}
							selected={selectedA}
							select={setSelectedA}
							forbidden={selectedB}
						/>
					)}
				</Grid2>
				<Grid2 size={{ xs: 12, sm: 6 }}>
					{survivors && (
						<TradersTable
							survivors={survivors}
							selected={selectedB}
							select={setSelectedB}
							forbidden={selectedA}
						/>
					)}
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
										minWidth: "48px",
									}}
								>
									<CompareArrowsIcon
										fontSize="large"
										color={
											isTradeBalanced
												? "success"
												: "action"
										}
										sx={
											isTradeBalanced
												? {
														fontSize: "48px",
														background: green[100],
														borderRadius: "25%",
														borderSpacing: "8px",
												  }
												: {
														fontSize: "32px",
												  }
										}
									/>
								</Box>
							}
						>
							<Box sx={{ flex: 1, width: "100%" }}>
								<TradingInventory
									survivor={survivorA}
									onTradeChange={handleTradeChangeA}
								/>
							</Box>
							<Box sx={{ flex: 1, width: "100%" }}>
								<TradingInventory
									survivor={survivorB}
									onTradeChange={handleTradeChangeB}
								/>
							</Box>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button
							variant="contained"
							color="primary"
							disabled={!isTradeBalanced}
							onClick={performTrade}
						>
							Complete Trade
						</Button>
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
					</DialogActions>
				</Dialog>
			)}
		</>
	);
}
