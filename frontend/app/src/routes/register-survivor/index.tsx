import { useActionState, useContext, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
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
import { API_BASE_URL, easyPost } from "../../utils";
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
	_: NotificationState,
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

	return await easyPost(
		`${API_BASE_URL}/survivors`,
		JSON.stringify(survivor),
		"Failed to register survivor",
		"Survivor registered successfully!",
	);
}

function RegisterSurvivor() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const setNotification = useContext(NotificationContext);
	const [state, formAction] = useActionState(submit, null);

	useEffect(() => {
		setNotification(state);
		if (state && "success" in state) {
			// It would be better to make this more fine grained
			// This approach likely doesn't work well with the getAll
			// design of the /survivors endpoint. But it's there to avoid
			// the N+1 problem, so there are tradeoffs.
			queryClient.invalidateQueries({
				queryKey: ["survivors"],
			});
			router.navigate({ replace: true, href: "/survivors" });
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
							<Grid2 size={{ xs: 12 }}>
								<Typography variant="h6">
									Last Known Location
								</Typography>
							</Grid2>

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
