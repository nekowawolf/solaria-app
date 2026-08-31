import api from "./api";
import { Order } from "@/types/order";

export interface CreateOrderPayload {
  order_code?: string;
  total_amount?: number;
  items: {
    menu_code: string;
    quantity: number;
    price?: number;
  }[];
  status?: string;
  payment_status?: string;
}

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    try {
      const response = await api.get("/orders");
      if (response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching orders", error);
      return [];
    }
  },

  create: async (data: CreateOrderPayload): Promise<Order> => {
    const payload = {
      items: data.items.map(item => ({
        menu_code: item.menu_code,
        quantity: item.quantity
      })),
      status: data.status,
      payment_status: data.payment_status
    };
    const response = await api.post("/orders", payload);
    return response.data;
  },

  updateStatus: async (code: string, status: string): Promise<Order> => {
    const response = await api.put(`/orders/${code}/status`, { status });
    return response.data;
  },
  delete: async (code: string): Promise<void> => {
    await api.delete(`/orders/${code}`);
  }
};