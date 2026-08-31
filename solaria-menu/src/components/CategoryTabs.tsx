interface CategoryTabsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide py-2">
      {categories.map((cat, i) => (
        <button
          key={i}
          onClick={() => onSelect(cat)}
          className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${selected === cat
              ? 'bg-[#B21B7A] text-white shadow-md'
              : 'bg-primary-light text-primary hover:bg-primary/20'
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}