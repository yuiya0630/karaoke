"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// 各データの型を定義しておくと、コードが安全で書きやすくなります
type StatsData = {
  summary: {
    totalSongs: number;
    averageScore: number;
    maxScore: number;
  };
  scoreRanking: {
    id: number;
    score: number;
    song: {
      title: string;
      artist: string;
    };
  }[];
  artistRanking: {
    artist: string;
    count: number;
  }[];
  scoreHistory: {
    name: number;
    score: number;
  }[];
};

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 認証チェック
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/auth/register');
        return false;
      }
      return true;
    };

    // 認証チェックが通った場合のみデータ取得を実行
    if (checkAuth()) {
      fetchStats();
    }
  }, [router]);

  // ページが読み込まれたら、APIから統計データを取得する
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (!response.ok) {
        throw new Error("データの取得に失敗しました");
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-600">ローディング中...</div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center mt-20 text-gray-600">
        データを表示できませんでした。
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 min-h-screen pb-20">
      {/* ヘッダー（ログアウトボタン付き） */}
      <header className="flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">統計・分析</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
          </svg>
          ログアウト
        </button>
      </header>
      
      <div className="container mx-auto p-4">

        {/* グラフ */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 h-64 border border-gray-200">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats.scoreHistory}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis domain={[80, "dataMax + 2"]} stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #cccccc",
                }}
                labelStyle={{ color: "#333333" }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="総楽曲数"
            value={`${stats.summary.totalSongs} 曲`}
          />
          <SummaryCard title="平均点" value={stats.summary.averageScore} />
          <SummaryCard title="最高点" value={stats.summary.maxScore} />
        </div>

        {/* 点数ランキング */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">
            点数ランキング
          </h2>
          <div className="space-y-2">
            {stats.scoreRanking.map((item, index) => (
              <RankingItem
                key={item.id}
                rank={index + 1}
                title={item.song.title}
                subtitle={item.song.artist}
                value={`${item.score} 点`}
              />
            ))}
          </div>
        </div>

        {/* よく歌うアーティスト */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">
            よく歌うアーティスト
          </h2>
          <div className="space-y-2">
            {stats.artistRanking.map((item, index) => (
              <RankingItem
                key={item.artist}
                rank={index + 1}
                title={item.artist}
                value={`${item.count} 回`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// UIの部品を小さなコンポーネントに分けると見通しが良くなります
const SummaryCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="bg-white border border-gray-200 p-4 rounded-lg text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-bold text-gray-900">{value}</p>
  </div>
);

const RankingItem = ({
  rank,
  title,
  subtitle,
  value,
}: {
  rank: number;
  title: string;
  subtitle?: string;
  value: string;
}) => (
  <div className="flex items-center bg-white p-3 rounded-md border border-gray-200">
    <span className="text-lg font-bold w-8 text-gray-700">{rank}</span>
    <div className="flex-grow">
      <p className="font-semibold text-gray-800">{title}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
    <span className="text-lg font-semibold text-gray-800">{value}</span>
  </div>
);
