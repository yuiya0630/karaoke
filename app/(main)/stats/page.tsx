"use client";

import { useEffect, useState } from "react";
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
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">ローディング中...</div>;
  }

  if (!stats) {
    return (
      <div className="text-center mt-20">データを表示できませんでした。</div>
    );
  }

  return (
    <div className="bg-gray-800 text-white min-h-screen pb-20">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">統計・分析</h1>

        {/* グラフ */}
        <div className="bg-gray-700 p-4 rounded-lg mb-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats.scoreHistory}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis domain={[80, "dataMax + 2"]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", border: "none" }}
                labelStyle={{ color: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
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
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">点数ランキング</h2>
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
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">よく歌うアーティスト</h2>
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
      {/* TODO: ボトムナビゲーションをコンポーネントとして配置 */}
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
  <div className="bg-gray-600 p-4 rounded-lg text-center">
    <p className="text-sm text-gray-300">{title}</p>
    <p className="text-xl font-bold">{value}</p>
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
  <div className="flex items-center bg-gray-600/50 p-3 rounded-md">
    <span className="text-lg font-bold w-8">{rank}</span>
    <div className="flex-grow">
      <p className="font-semibold">{title}</p>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
    <span className="text-lg font-semibold">{value}</span>
  </div>
);
