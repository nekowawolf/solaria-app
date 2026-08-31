interface QuantityButtonProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantityButton({ quantity, onIncrease, onDecrease }: QuantityButtonProps) {
  return (
    <div className="flex items-center space-x-3 bg-primary-light px-3 py-1 rounded-full text-primary font-medium w-fit">
      <button onClick={onDecrease} className="w-5 h-5 flex items-center justify-center font-bold hover:scale-110 transition-transform">
        -
      </button>
      <span className="text-sm">{quantity}</span>
      <button onClick={onIncrease} className="w-5 h-5 flex items-center justify-center font-bold hover:scale-110 transition-transform">
        +
      </button>
    </div>
  );
}