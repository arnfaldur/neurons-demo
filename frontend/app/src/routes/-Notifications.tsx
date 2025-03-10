import {
	createContext,
	type Dispatch,
	type SetStateAction,
	useState,
useEffect
} from "react";
import { Snackbar, Alert } from "@mui/material";

export type NotificationState = null | { success: string } | { error: string };

export const NotificationContext =
	createContext<Dispatch<SetStateAction<NotificationState>>>(null);

export function NotificationProvider({ children }) {
	const [notification, setNotification] = useState<NotificationState>(null);
	return (
		<NotificationContext.Provider value={setNotification}>
			{children}

            <Notifications state={notification} />
		</NotificationContext.Provider>
	);
}

function Notifications({ state }: { state: NotificationState }) {
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
                    {success}
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
