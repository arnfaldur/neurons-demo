import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Container,
	Box,
} from "@mui/material";

import { NotificationProvider } from "./-Notifications";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						Neurons Demo
					</Typography>
					<Button color="inherit" component={Link} to="/dashboard">
						Dashboard
					</Button>
					<Button
						color="inherit"
						component={Link}
						to="/register-survivor"
					>
						Register Survivor
					</Button>
				</Toolbar>
			</AppBar>
			<Container>
				<Box sx={{ mt: 4 }}>
					<NotificationProvider>
						<Outlet />
					</NotificationProvider>
				</Box>
			</Container>
			<TanStackRouterDevtools position="bottom-right" />
		</>
	);
}
