import { Home, Camera, BarChart2, History } from "lucide-react";
import Link from "next/link";

// ダミーデータ
const latestScore = {
  score: 90,
  songTitle: "summersong",
  artist: "yui",
  comment:
    "感情の込め方がピカイチです。あなたのこの曲に対する想いが伝わってくるようでした。",
};

const stats = {
  average: 90.098,
  highest: 99.345,
  lowest: 70.458,
};

export default function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      {/* メインコンテンツ */}
      <main className="p-4">
        {/* 最新の採点結果セクション */}
        <section className="text-center mb-6">
          <h1 className="text-lg font-bold text-gray-700 mb-4">
            最新の採点結果
          </h1>
          <div className="relative inline-block">
            {/* 円グラフの部分 */}
            <div className="w-64 h-64 bg-white rounded-full flex flex-col items-center justify-center shadow-lg border-8 border-gray-200">
              {/* 実際の円グラフはSVGやライブラリを使うとより正確に表現できますが、ここでは雰囲気を出しています */}
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-8 border-r-8"></div>
              <span className="text-7xl font-bold text-gray-800 tracking-tighter">
                {latestScore.score}
              </span>
              <p className="text-xl text-gray-600 mt-1">
                {latestScore.songTitle}
              </p>
              <p className="text-sm text-gray-500">{latestScore.artist}</p>
            </div>
          </div>
        </section>

        {/* 分析レポートセクション */}
        <section className="mb-6">
          <h2 className="text-md font-bold text-gray-700 mb-2">分析レポート</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">{latestScore.comment}</p>
          </div>
        </section>

        {/* 統計セクション */}
        <section className="space-y-4">
          <StatBar label="平均点" value={stats.average} max={100} />
          <StatBar label="最高点" value={stats.highest} max={100} />
          <StatBar label="最低点" value={stats.lowest} max={100} />
        </section>
      </main>

      {/* ボトムナビゲーション */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white shadow-t-lg">
        <nav className="flex justify-around py-2">
          <Link href="/" className="flex flex-col items-center text-blue-400">
            <Home size={24} />
            <span className="text-xs mt-1">ホーム</span>
          </Link>
          <Link href="/scores/new" className="flex flex-col items-center">
            <Camera size={24} />
            <span className="text-xs mt-1">撮影</span>
          </Link>
          <a href="/stats" className="flex flex-col items-center">
            <BarChart2 size={24} />
            <span className="text-xs mt-1">統計</span>
          </a>
          <a href="#" className="flex flex-col items-center">
            <History size={24} />
            <span className="text-xs mt-1">履歴</span>
          </a>
        </nav>
      </footer>
    </div>
  );
}

// 統計バーコンポーネント
// Propsの型定義
interface StatBarProps {
  label: string;
  value: number;
  max: number;
}

const StatBar = ({ label, value, max }: StatBarProps) => {
  const percentage = (value / max) * 100;

  return (
    <div className="bg-white p-3 rounded-lg shadow">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-800">
          {value.toFixed(3)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`bg-blue-500 h-2.5 rounded-full stat-bar`}
          data-width={percentage}
        ></div>
      </div>
    </div>
  );
};
