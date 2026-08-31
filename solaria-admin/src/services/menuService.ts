import api from "./api";
import { Menu, CreateMenuInput, UpdateMenuInput } from "@/types/menu";

export const menuService = {
  getAll: async (): Promise<Menu[]> => {
    try {
      const response = await api.get("/menus");
      return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching menus", error);
      return [];
    }
  },

  create: async (data: CreateMenuInput): Promise<Menu> => {
    const response = await api.post("/menus", data);
    return response.data;
  },

  update: async (id: number, data: UpdateMenuInput): Promise<Menu> => {
    const response = await api.put(`/menus/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/menus/${id}`);
  },

  getByCode: async (code: string): Promise<Menu | null> => {
    try {
      const response = await api.get(`/menus?code=${code}`);
      const menus = response.data?.data || response.data || [];
      if (Array.isArray(menus)) {
        return menus.find((m: Menu) => m.code === code) || null;
      }
      return menus;
    } catch (error) {
      console.error("Error fetching menu by code", error);
      return null;
    }
  }
};