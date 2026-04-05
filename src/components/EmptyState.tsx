import Link from 'next/link';
import { IoCartOutline } from 'react-icons/io5';

interface EmptyStateProps {
  title: string;
  message: string;
  actionText: string;
  actionHref: string;
}

export default function EmptyState({ title, message, actionText, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center mb-6 text-primary shadow-sm">
        <IoCartOutline className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 mb-8 max-w-xs">{message}</p>
      <Link href={actionHref} className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full font-bold transition-colors shadow-md w-full max-w-xs">
        {actionText}
      </Link>
    </div>
  );
}