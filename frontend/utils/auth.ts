import axios from "axios";

const API_URL = 'http://localhost:8000';

const extractErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (typeof data?.error === "string") {
            return data.error;
        }

        if (Array.isArray(data?.username) && typeof data.username[0] === "string") {
            return data.username[0];
        }

        if (Array.isArray(data?.non_field_errors) && typeof data.non_field_errors[0] === "string") {
            return data.non_field_errors[0];
        }
    }

    return fallbackMessage;
};

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login/login/`, {
            username,
            password
        }, {withCredentials: true});
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error, 'Login failed'));
    }
}

export const registerUser = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login/user/register/`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error, 'Registration failed'));
    }
}

export const logoutUser = async () => {
    try {
        const response = await axios.post(`${API_URL}/login/logout/`, {}, {withCredentials: true});
        return response.data;
    } catch {
        throw new Error('Logout failed');
    }
}

export const getUserInfo = async () => {
    try {
        const response = await axios.get(`${API_URL}/login/user-info/`, {withCredentials: true});
        return response.data;
    } catch {
        throw new Error('Failed to get user info');
    }
}

export const refreshToken = async () => {
    try {
        const response = await axios.post(`${API_URL}/login/refresh/`, {}, {withCredentials: true});
        return response.data;
    } catch {
        throw new Error('Failed to refresh token');
    }
}
