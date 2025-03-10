import { useEffect, useState } from "react";
import {
	Grid2,
	TextField,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
} from "@mui/material";

// Interface for the local state of personal info
export interface PersonalInfo {
	name: string;
	age: number | "";
	gender: string;
}

// Custom hook for field validation
function useField<T>(initialValue: T, validateFn: (value: T) => string | null) {
	const [value, setValue] = useState<T>(initialValue);
	const [error, setError] = useState("");
	const [touched, setTouched] = useState(false);

	useEffect(() => {
		// Auto-mark as touched if there's a value
		if (value !== initialValue) {
			setTouched(true);
		}

		// Skip validation if not touched
		if (!touched) return;

		// Run validation
		const validationError = validateFn(value);
		setError(validationError || "");
	}, [touched, value, initialValue, validateFn]);

	return {
		value,
		setValue,
		error,
		touched,
		setTouched,
		hasError: !!error,
	};
}

// Standalone version that manages its own state
export function PersonalInfoSection() {
	return (
		<>
			<Grid2 size={{ xs: 12 }}>
				<Typography variant="h6">Personal Information</Typography>
			</Grid2>

			<Grid2 size={{ xs: 12, sm: 5 }}>
				<NameField />
			</Grid2>

			<Grid2 size={{ xs: 5.5, sm: 3 }}>
				<AgeField />
			</Grid2>

			<Grid2 size={{ xs: 6.5, sm: 4 }}>
				<GenderField />
			</Grid2>
		</>
	);
}

function GenderField() {
	const { value, setValue, error, setTouched, hasError } = useField(
		"",
		(value) => {
			if (value === "") return "Gender is required";
			return null;
		},
	);

	return (
		<FormControl fullWidth error={hasError} required>
			<InputLabel>Gender</InputLabel>
			<Select
				name="gender"
				label="Gender"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onClick={() => setTouched(true)}
			>
				<MenuItem value="male">Male</MenuItem>
				<MenuItem value="female">Female</MenuItem>
				<MenuItem value="other">Other</MenuItem>
			</Select>
			{error && <FormHelperText>{error}</FormHelperText>}
		</FormControl>
	);
}

function AgeField() {
	const { value, setValue, error, hasError } = useField("", (value) => {
		if (value === "") return "Age is required";
		if (Number(value) < 0) return "Age must be a positive number";
		return null;
	});

	return (
		<TextField
			fullWidth
			label="Age"
			name="age"
			type="number"
			slotProps={{ htmlInput: { min: 0 } }}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			error={hasError}
			helperText={error}
			required
		/>
	);
}

function NameField() {
	const { value, setValue, error, hasError } = useField("", (value) => {
		if (!value.trim()) return "Name is required";
		return null;
	});

	return (
		<TextField
			fullWidth
			label="Name"
			name="name"
			value={value}
			onChange={(e) => setValue(e.target.value)}
			error={hasError}
			helperText={error}
			required
		/>
	);
}
