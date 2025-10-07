"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 型定義
interface LatestScoreData {
  score: number;
  songTitle: string;
  artist: string;
  comment: string;
}

interface StatsData {
  average: number;
  highest: number;
  lowest: number;
}

interface HomePageData {
  latestScore: LatestScoreData;
  stats: StatsData;
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center h-screen">
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
      role="alert"
    >
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  </div>
);

export default function HomePage() {
  const router = useRouter();
  const [data, setData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0); // アニメーション用スコア

  // 認証チェック
  useEffect(() => {
    const checkAuth = () => {
      // ローカルストレージでトークンをチェック（ログイン画面と同じキー名を使用）
      const token = localStorage.getItem('token');
      
      if (!token) {
        // 認証情報がない場合は新規登録画面にリダイレクト
        router.push('/auth/register');
        return false;
      }
      return true;
    };

    // 認証チェックが通った場合のみデータ取得を実行
    if (checkAuth()) {
      fetchData();
    }
  }, [router]);

    const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/home", { cache: "no-store" });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "データの取得に失敗しました");
      }

      const result: HomePageData = await response.json();
      setData(result);

      // スコアをアニメーションで表示
      let start = 0;
      const end = result.latestScore.score;
      const duration = 1500;
      const stepTime = 10;
      const increment = (end - start) / (duration / stepTime);

      const interval = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(interval);
        }
        setAnimatedScore(parseFloat(start.toFixed(2)));
      }, stepTime);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("予期せぬエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!data) return <ErrorDisplay message="表示するデータがありません。" />;

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;

  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      {/* ヘッダー（ログアウトボタン付き） */}
      <header className="flex justify-between items-center p-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">カラオケアプリ</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          ログアウト
        </button>
      </header>
      
      <main className="p-4">
        {/* 最新の採点結果 */}
        <section className="text-center mb-6">
          <h1 className="text-lg font-bold text-gray-700 mb-4">
            最新の採点結果
          </h1>

          {/* 円グラフ（SVG） */}
          <div className="relative inline-block">
            <svg
              width="260"
              height="260"
              viewBox="0 0 260 260"
              className="transform -rotate-90"
            >
              {/* 背景円 */}
              <circle
                cx="130"
                cy="130"
                r={radius}
                stroke="#E5E7EB"
                strokeWidth="16"
                fill="none"
              />
              {/* スコアに応じた円 */}
              <circle
                cx="130"
                cy="130"
                r={radius}
                stroke="#3B82F6"
                strokeWidth="16"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>

            {/* 中央テキスト */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-7xl font-bold text-gray-800 tracking-tighter">
                {Math.round(animatedScore)}
              </span>
              <p className="text-xl text-gray-600 mt-1">
                {data.latestScore.songTitle}
              </p>
              <p className="text-sm text-gray-500">{data.latestScore.artist}</p>
            </div>
          </div>
        </section>

        {/* 分析レポート */}
        <section className="mb-6">
          <h2 className="text-md font-bold text-gray-700 mb-2">分析レポート</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">{data.latestScore.comment}</p>
          </div>
        </section>

        {/* 統計バー */}
        <section className="space-y-4">
          <StatBar label="平均点" value={data.stats.average} max={100} />
          <StatBar label="最高点" value={data.stats.highest} max={100} />
          <StatBar label="最低点" value={data.stats.lowest} max={100} />
        </section>
      </main>
    </div>
  );
}

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
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
