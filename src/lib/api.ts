// Define a type for the response from the API
type ApiResponse<T> = {
	data: T;
	message?: string;
	// Add other common response fields as needed
};

// Define an interface for request options
interface RequestOptions {
	headers?: Record<string, string>;
	params?: Record<string, string>;
}

const BASE_URL = "http://localhost:3000"; // Replace with your API base URL

// Helper function to handle response
const handleResponse = async <T>(
	response: Response,
): Promise<ApiResponse<T>> => {
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "An error occurred");
	}
	return response.json();
};

// GET request
export const get = async <T>(
	endpoint: string,
	options: RequestOptions = {},
): Promise<ApiResponse<T>> => {
	const { headers = {}, params = {} } = options;
	const url = new URL(`${BASE_URL}${endpoint}`);

	for (const [key, value] of Object.entries(params)) {
		url.searchParams.append(key, value);
	}

	try {
		const response = await fetch(url.toString(), {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
		});
		return handleResponse<T>(response);
	} catch (error) {
		console.error("GET request failed:", error);
		throw error;
	}
};

// POST request
export const post = async <T, U>(
	endpoint: string,
	data: T,
	options: RequestOptions = {},
): Promise<ApiResponse<U>> => {
	const { headers = {} } = options;
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
			body: JSON.stringify(data),
		});
		return handleResponse<U>(response);
	} catch (error) {
		console.error("POST request failed:", error);
		throw error;
	}
};

// PUT request
export const put = async <T, U>(
	endpoint: string,
	data: T,
	options: RequestOptions = {},
): Promise<ApiResponse<U>> => {
	const { headers = {} } = options;
	try {
		console.log("body:", JSON.stringify(data));
		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
			body: JSON.stringify(data),
		});
		return handleResponse<U>(response);
	} catch (error) {
		console.error("PUT request failed:", error);
		throw error;
	}
};

// DELETE request
export const del = async <T>(
	endpoint: string,
	options: RequestOptions = {},
): Promise<ApiResponse<T>> => {
	const { headers = {} } = options;
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
		});
		return handleResponse<T>(response);
	} catch (error) {
		console.error("DELETE request failed:", error);
		throw error;
	}
};
