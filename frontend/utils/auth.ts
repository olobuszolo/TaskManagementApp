import axios from "axios";

const API_URL = 'http://localhost:8000';

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login/login/`, {
            username,
            password
        }, {withCredentials: true});
        return response.data;
    } catch (e) {
        throw new Error('Login failed');
    }
}

export const logoutUser = async () => {
    try {
        const response = await axios.post(`${API_URL}/login/logout/`, {}, {withCredentials: true});
        return response.data;
    } catch (e) {
        throw new Error('Logout failed');
    }
}

export const getUserInfo = async () => {
    try {
        const response = await axios.get(`${API_URL}/login/user-info/`, {withCredentials: true});
        return response.data;
    } catch (e) {
        throw new Error('Failed to get user info');
    }
}

export const refreshToken = async () => {
    try {
        const response = await axios.post(`${API_URL}/login/refresh/`, {}, {withCredentials: true});
        return response.data;
    } catch (e) {
        throw new Error('Failed to refresh token');
    }
}
