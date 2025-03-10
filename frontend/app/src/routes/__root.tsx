import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Container,
	Box,
	useMediaQuery,
	IconButton,
	Menu,
	MenuItem,
	useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

import { NotificationProvider } from "./-Notifications";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						Neurons Demo
					</Typography>

					{isSmallScreen ? (
						<HamburgerMenu
							anchorEl={anchorEl}
							setAnchorEl={setAnchorEl}
						/>
					) : (
						<>
							<Button
								color="inherit"
								component={Link}
								to="/survivors"
							>
								Survivors
							</Button>
							<Button
								color="inherit"
								component={Link}
								to="/trading"
							>
								Trading
							</Button>
							<Button
								color="inherit"
								component={Link}
								to="/register-survivor"
							>
								Register Survivor
							</Button>
						</>
					)}
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
function HamburgerMenu({
	anchorEl,
	setAnchorEl,
}: {
	anchorEl: HTMLElement | null;
	setAnchorEl: (e: HTMLElement | null) => void;
}) {
	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<>
			<IconButton
				size="large"
				edge="end"
				color="inherit"
				aria-label="menu"
				onClick={handleMenu}
			>
				<MenuIcon />
			</IconButton>
			<Menu
				id="menu-appbar"
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<MenuItem
					component={Link}
					to="/dashboard"
					onClick={handleClose}
				>
					Dashboard
				</MenuItem>
				<MenuItem component={Link} to="/trading" onClick={handleClose}>
					Trading
				</MenuItem>
				<MenuItem
					component={Link}
					to="/register-survivor"
					onClick={handleClose}
				>
					Register Survivor
				</MenuItem>
			</Menu>
		</>
	);
}
