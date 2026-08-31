export interface Order {
  id: number;
  order_code: string;
  total_amount: number;
  status: string;
  payment_status: string; 
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  menu_id: number;
  menu_name: string;
  quantity: number;
  price: number;
}

export interface OrderWithItems extends Order {
  items?: OrderItem[];
}