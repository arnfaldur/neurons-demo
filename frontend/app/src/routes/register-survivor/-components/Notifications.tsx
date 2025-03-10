import { Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { NotificationState } from "../../__root";

export function Notifications({ state }: { state: NotificationState }) {
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		if (!state) {
			return;
		}
		if ("success" in state) {
			setSuccess(state.success);
		}
		if ("error" in state) {
			setError(state.error);
		}
	}, [state]);

	const onSuccessClose = () => {
		setSuccess(null);
	};
	const onErrorClose = () => {
		setError(null);
	};

	return (
		<>
			{/* Success Message */}
			<Snackbar
				open={!!success}
				autoHideDuration={6000}
				onClose={onSuccessClose}
			>
				<Alert onClose={onSuccessClose} severity="success">
					Survivor registered successfully!
				</Alert>
			</Snackbar>

			{/* Error Message */}
			<Snackbar
				open={!!error}
				autoHideDuration={6000}
				onClose={onErrorClose}
			>
				<Alert onClose={onErrorClose} severity="error">
					{error}
				</Alert>
			</Snackbar>
		</>
	);
}
