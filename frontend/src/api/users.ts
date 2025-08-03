import { api } from "./apiClient";

export const getUsersWithStats = async () => {
  try {
    const response = await api.get("/users/stats");
    return response;
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
};