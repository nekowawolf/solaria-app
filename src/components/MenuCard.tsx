import { MenuItem } from '../types/menu';
import { IoAddOutline } from 'react-icons/io5';

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAdd }: MenuCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6 flex flex-col sm:flex-row">
      <div className="h-56 sm:h-auto sm:w-1/3 relative">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm font-bold text-gray-800 shadow-sm">
          Rp {item.price.toLocaleString('id-ID')}
        </div>
      </div>
      <div className="p-5 sm:w-2/3 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-xl text-gray-800">{item.name}</h3>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">{item.description}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => onAdd(item)}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xl font-medium shadow-md hover:bg-primary-dark transition-colors"
          >
            <IoAddOutline className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}