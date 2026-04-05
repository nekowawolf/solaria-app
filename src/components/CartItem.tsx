import { CartItem as CartItemType } from "../types/menu";
import QuantityButton from "./QuantityButton";

interface CartItemProps {
  item: CartItemType;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
}: CartItemProps) {

  const formatPrice = (price: number) =>
    price.toLocaleString("id-ID");

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center space-x-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 rounded-full object-cover shadow-sm"
        />

        <div>
          <h4 className="font-bold text-gray-800 text-sm sm:text-base">
            {item.name}
          </h4>

          <div className="mt-2">
            <QuantityButton
              quantity={item.quantity}
              onIncrease={() => onIncrease(item.id)}
              onDecrease={() => onDecrease(item.id)}
            />
          </div>
        </div>
      </div>

      {/* FORMAT RUPIAH */}
      <div className="font-bold text-gray-800">
        Rp {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
}