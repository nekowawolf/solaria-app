export interface Menu {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export type CreateMenuInput = Omit<Menu, "id" | "created_at" | "updated_at">;
export type UpdateMenuInput = Partial<CreateMenuInput>;