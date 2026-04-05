import Image from 'next/image';

export default function Header() {
  return (
    <header className="px-6 py-5 flex items-center justify-center bg-white/90 backdrop-blur-md sticky top-0 z-10 border-b border-gray-50">
      <Image
        src="/img/solaria.png"
        alt="Solaria Logo"
        width={120}
        height={40}
        priority
        className="h-10 w-auto"
      />
    </header>
  );
}