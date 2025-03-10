export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function easyPost(
	url: string,
	body: string,
	error: string,
	success: string,
) {
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
