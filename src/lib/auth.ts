import { getRoleDashboardPath } from "./role-redirect";

export const authService = {
  login: async (identifier: string, password: string) => {
    const response = await fetch("/api/auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al iniciar sesión");
    }

    if (data.data?.user) {
      localStorage.setItem("user", JSON.stringify(data.data.user));
      if (data.data.token) {
        localStorage.setItem("token", data.data.token);
      }
    }

    // Esperar un momento para que las cookies se establezcan
    await new Promise(resolve => setTimeout(resolve, 100));

    return data;
  },

  logout: async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");

      window.location.href = "/";
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/";
    }
  },

  getCurrentUser: () => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user.role.name;
  },

  getRoleDashboard: () => {
    const roleName = authService.getUserRole();
    return roleName ? getRoleDashboardPath(roleName) : "/dashboard";
  },

  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  },
};
