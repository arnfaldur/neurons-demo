import { useEffect, useState } from "react";
import { Grid2, TextField } from "@mui/material";

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

export function LocationSection({
	last_location,
}: {
	last_location?: [number, number];
}) {
	const latitude = useCoordinateField(last_location?.[0] ?? 0);
	const longitude = useCoordinateField(last_location?.[1] ?? 0);

	return (
		<>
			<Grid2 size={{ xs: 6, sm: 4 }}>
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

			<Grid2 size={{ xs: 6, sm: 4 }}>
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
