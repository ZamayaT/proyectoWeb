import axios from "axios";
import axiosSecure from "../utils/axiosSecure";

type Credentials = {
    username: string;
    password: string;
};

const login = async (credentials: Credentials) => {
    const response = await axios.post("/api/auth/login", credentials);

    const csrfToken = response.headers["x-csrf-token"];

    if (csrfToken) {
        localStorage.setItem("csrfToken", csrfToken);
    }

    return response.data;
};

const register = async (credentials: Credentials) => {
    const response = await axios.post("/api/users", credentials);
    return response.data;
};


const restoreLogin = async () => {
    try {
        const response = await axiosSecure.get("/api/auth/login/me");
        return response.data; // Usuario logueado
    } catch {
        return null; // No logueado
    }
};

const logout = async () => {
    await axios.post("/api/auth/logout");
    localStorage.removeItem("csrfToken");
};

export default { login, restoreLogin, logout, register };
