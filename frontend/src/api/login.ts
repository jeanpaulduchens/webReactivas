import axiosSecure from "@utils/axiosSecure";

type Credentials = {
    username: string;
    password: string;
};

const login = async (credentials: Credentials) => {
    const response = await axiosSecure.post("/api/login", credentials);

    const csrfToken = response.headers["x-csrf-token"];

    if (csrfToken) {
        localStorage.setItem("csrfToken", csrfToken);
    }

    // Guardar información del usuario en localStorage
    if (response.data) {
        localStorage.setItem("userData", JSON.stringify(response.data));
    }

    return response.data;
};

const restoreLogin = async () => {
    try {
        const response = await axiosSecure.get("/api/login/me");
        return response.data; // Usuario logueado
    } catch {
        return null; // No logueado
    }
};

const logout = () => {
    return axiosSecure.post("/api/login/logout").then(() => {
        localStorage.removeItem("csrfToken");
        localStorage.removeItem("userData");
    });
};

export { login, restoreLogin, logout };
