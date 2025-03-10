import { useActionState, useContext, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
	Box,
	Button,
	Container,
	Grid2,
	Paper,
	Typography,
} from "@mui/material";

import { PersonalInfoSection } from "./-components/PersonalInfoSection";
import { LocationSection } from "./-components/LocationSection";
import { InventorySection } from "./-components/InventorySection";
import { Notifications } from "./-components/Notifications";
import { API_BASE_URL } from "../../utils";
import { useRouter } from "@tanstack/react-router";
import { NotificationContext, NotificationState } from "../-Notifications";

export const Route = createFileRoute("/register-survivor/")({
	component: RegisterSurvivor,
});

type InventoryItem = "water" | "food" | "medication" | "ammunition";
const inventoryItems: InventoryItem[] = [
	"water",
	"food",
	"medication",
	"ammunition",
];

async function submit(
	_: ActionState,
	formData: FormData,
): Promise<NotificationState> {
	// create last_location object from formData
	const last_location = [formData.get("latitude"), formData.get("longitude")];
	// and remove the coordinates from the formData
	formData.delete("latitude");
	formData.delete("longitude");

	// create inventory object from formData
	const inventory = Object.fromEntries(
		inventoryItems.map((i) => [i, formData.get(`inventory.${i}`)]),
	);
	// and remove the items from the formData
	inventoryItems.forEach((i) => formData.delete(`inventory.${i}`));

	const survivor = {
		...Object.fromEntries(formData),
		last_location,
		inventory,
	};

	try {
		const response = await fetch(`${API_BASE_URL}/survivors`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(survivor),
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.detail || "Failed to register survivor");
		}
		return {
			success: "Survivor registered successfully!",
		};
	} catch (error) {
		return {
			error:
				error instanceof Error
					? error.message
					: "Unknown error occurred",
		};
	}
}

function RegisterSurvivor() {
	const router = useRouter();
	const setNotification = useContext(NotificationContext);
	const [state, formAction] = useActionState(submit);

	useEffect(() => {
		setNotification(state);
		if (state && "success" in state) {
			router.navigate({ replace: true, href: "/dashboard" });
		}
	}, [state]);

	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 4, mb: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Register Survivor
				</Typography>

				<Paper elevation={3} sx={{ p: 3 }}>
					<form action={formAction}>
						<Grid2 container spacing={3}>
							{/* Personal Information */}
							<PersonalInfoSection />

							{/* Location */}
							<LocationSection />

							{/* Inventory */}
							<InventorySection />

							{/* Submit Button */}
							<Grid2 size={{ xs: 12 }}>
								<Button
									variant="contained"
									color="primary"
									type="submit"
									size="large"
									sx={{ mt: 2 }}
								>
									Register Survivor
								</Button>
							</Grid2>
						</Grid2>
					</form>
				</Paper>
			</Box>
		</Container>
	);
}
