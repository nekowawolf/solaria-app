export interface TaxCalculation {
  subtotal: number;
  tax: number;
  beforeRounding: number;
  rounding: number;
  total: number;
}

export const calculateTax = (price: number, quantity: number): TaxCalculation => {
  const subtotal = price * quantity;
  const tax = subtotal * 0.10; // PB1 10%
  const beforeRounding = subtotal + tax;
  
  const roundedUp = Math.round(beforeRounding / 1000) * 1000;
  
  const rounding = Number((roundedUp - beforeRounding).toFixed(2));
  const total = roundedUp;

  return {
    subtotal,
    tax,
    beforeRounding,
    rounding,
    total,
  };
};