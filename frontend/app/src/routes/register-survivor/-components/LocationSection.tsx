import { useEffect, useState } from "react";
import { Grid2, TextField, Typography } from "@mui/material";

// Coordinate field hook (latitude/longitude)
function useCoordinateField(initialValue: number = 0) {
	const [value, setValue] = useState(initialValue.toString());
	const [error, setError] = useState("");
	const [touched, setTouched] = useState(false);

	useEffect(() => {
		// Auto-mark as touched if there's a value
		if (value !== initialValue.toString()) {
			setTouched(true);
		}

		// Skip validation if not touched
		if (!touched) return;

		// Validate coordinates
		if (!value.trim()) {
			setError("This field is required");
		} else if (isNaN(Number(value))) {
			setError("Must be a valid number");
		} else {
			setError("");
		}
	}, [touched, value, initialValue]);

	return {
		value,
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
			setValue(e.target.value);
		},
		error,
		hasError: !!error,
	};
}

export function LocationSection() {
	const latitude = useCoordinateField();
	const longitude = useCoordinateField();

	return (
		<>
			<Grid2 size={{ xs: 12 }}>
				<Typography variant="h6">Last Known Location</Typography>
			</Grid2>

			<Grid2 size={{ xs: 12, sm: 6 }}>
				<TextField
					fullWidth
					label="Latitude"
					name="latitude"
					type="number"
					value={latitude.value}
					onChange={latitude.onChange}
					error={latitude.hasError}
					helperText={latitude.error}
					required
				/>
			</Grid2>

			<Grid2 size={{ xs: 12, sm: 6 }}>
				<TextField
					fullWidth
					label="Longitude"
					name="longitude"
					type="number"
					value={longitude.value}
					onChange={longitude.onChange}
					error={longitude.hasError}
					helperText={longitude.error}
					required
				/>
			</Grid2>
		</>
	);
}
