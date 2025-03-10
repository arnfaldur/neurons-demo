export const API_BASE_URL = "http://localhost:8000";

export async function easyPost(url, body, error, success) {
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.detail || error);
		}
		return {
			success,
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
