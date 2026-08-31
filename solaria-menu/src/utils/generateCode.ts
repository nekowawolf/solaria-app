import { CartItem } from '../types/menu';

export const formatOrderCodes = (cartItems: CartItem[]): string[] => {
  return cartItems.map(item => `${item.code} ×${item.quantity}`);
};