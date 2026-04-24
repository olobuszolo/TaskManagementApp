import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = "http://localhost:8000";

"This module sets up an Axios instance with a response interceptor to handle token refresh logic. When a 401 Unauthorized error is encountered, it attempts to refresh the access token using a single shared promise to prevent multiple simultaneous refresh requests. If the refresh is successful, it retries the original request. If the refresh fails or if the original request was for login or token refresh endpoints, it rejects the error."

type RetriableRequestConfig = InternalAxiosRequestConfig & {
	_retry?: boolean;
};

let refreshPromise: Promise<unknown> | null = null;

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

const refreshAccessToken = async () => {
	if (!refreshPromise) {
		refreshPromise = api
			.post("/login/token/refresh/")
			.finally(() => {
				refreshPromise = null;
			});
	}

	return refreshPromise;
};

api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as RetriableRequestConfig | undefined;
		const status = error.response?.status;
		const requestUrl = originalRequest?.url ?? "";

		if (!originalRequest || status !== 401 || originalRequest._retry) {
			return Promise.reject(error);
		}

		if (requestUrl.includes("/login/login/") || requestUrl.includes("/login/token/refresh/")) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		try {
			await refreshAccessToken();
			return api(originalRequest);
		} catch (refreshError) {
			return Promise.reject(refreshError);
		}
	},
);

export { API_URL, api };
