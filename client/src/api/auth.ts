import { api } from "./apiClient";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
};

export const logout = async () => {
    try {
      const response = await api.post("/auth/logout");
      return response;
    } catch (error) {
      console.error("Error en la llamada a la API:", error);
      throw error;
    }
  };
