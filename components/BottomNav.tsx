import { Home, Camera, BarChart2, History } from "lucide-react";
import Link from "next/link";

export default function BottomNav() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white shadow-t-lg z-50">
      <nav className="flex justify-around py-2">
        <Link href="/" className="flex flex-col items-center text-blue-400">
          <Home size={24} />
          <span className="text-xs mt-1">ホーム</span>
        </Link>
        <Link href="/scores/new" className="flex flex-col items-center">
          <Camera size={24} />
          <span className="text-xs mt-1">撮影</span>
        </Link>
        <Link href="/stats" className="flex flex-col items-center">
          <BarChart2 size={24} />
          <span className="text-xs mt-1">統計</span>
        </Link>
        <Link href="/scores" className="flex flex-col items-center">
          <History size={24} />
          <span className="text-xs mt-1">履歴</span>
        </Link>
      </nav>
    </footer>
  );
}