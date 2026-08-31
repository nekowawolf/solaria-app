import { MenuItem } from '../types/menu';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const menuService = {
  getAll: async (): Promise<MenuItem[]> => {
    try {
      const response = await fetch(`${API_URL}/menus`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      // Handle either { data: [...] } format or direct array
      const menus = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
      
      // Ensure prices are numeric. If API returns float, it handles it.
      return menus.map((menu: any) => ({
        ...menu,
        price: Number(menu.price),
        image: menu.image_url || menu.image || 'https://akcdn.detik.net.id/visual/2025/01/17/solaria-1.jpeg?w=260&q=90' // fallback image
      }));
    } catch (error) {
      console.error("Error fetching menus", error);
      return [];
    }
  }
};