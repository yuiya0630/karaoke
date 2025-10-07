"use client";

import { useState, useEffect } from "react"; // useStateとuseEffectをインポート
import { useRouter } from "next/navigation";

export default function ScoreInputPage() {
  const router = useRouter();
  // 各入力フォームの状態を管理するためのState
  const [score, setScore] = useState("");
  const [artist, setArtist] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [comment, setComment] = useState("");

  // 認証チェック
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/register');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  // フォームが送信されたときの処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // フォーム送信時のデフォルトのページリロードを防ぐ

    try {
      // Step 2 で作成したAPIにデータをPOSTリクエストで送信
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score, artist, songTitle, comment }),
      });

      if (!response.ok) {
        throw new Error("データの保存に失敗しました。");
      }

      const data = await response.json();
      alert(data.message); // 成功メッセージをアラートで表示

      // フォームを空にする
      setScore("");
      setArtist("");
      setSongTitle("");
      setComment("");
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました。");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー（ログアウトボタン付き） */}
      <header className="flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">採点データ入力</h1>
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
      
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] text-black">
      <div className="w-full max-w-lg p-8 rounded-xl shadow-lg border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold">採点データ入力</h1>
        </div>

        {/* handleSubmit関数をonSubmitに設定 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 点数入力欄 */}
          <div>
            <label
              htmlFor="score"
              className="block text-sm font-semibold text-black mb-1"
            >
              点数
            </label>
            <input
              type="number"
              id="score"
              value={score} // stateの値を表示
              onChange={(e) => setScore(e.target.value)} // 入力時にstateを更新
              min="0"
              max="100"
              className="mt-1 block w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-200 text-black"
              required // 入力必須にする
            />
          </div>

          {/* アーティスト名入力欄 */}
          <div>
            <label
              htmlFor="artist"
              className="block text-sm font-semibold text-black mb-1"
            >
              アーティスト名
            </label>
            <input
              type="text"
              id="artist"
              value={artist} // stateの値を表示
              onChange={(e) => setArtist(e.target.value)} // 入力時にstateを更新
              className="mt-1 block w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-200 text-black"
              required // 入力必須にする
            />
          </div>

          {/* 曲名入力欄 */}
          <div>
            <label
              htmlFor="songTitle"
              className="block text-sm font-semibold text-black mb-1"
            >
              曲名
            </label>
            <input
              type="text"
              id="songTitle"
              value={songTitle} // stateの値を表示
              onChange={(e) => setSongTitle(e.target.value)} // 入力時にstateを更新
              className="mt-1 block w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-200 text-black"
              required // 入力必須にする
            />
          </div>

          {/* コメント入力欄 */}
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-semibold text-black mb-1"
            >
              コメント
            </label>
            <textarea
              id="comment"
              value={comment} // stateの値を表示
              onChange={(e) => setComment(e.target.value)} // 入力時にstateを更新
              rows={4}
              className="mt-1 block w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-200 resize-none text-black "
            />
          </div>

          {/* 保存ボタン */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-white border border-gray-700 text-black font-bold text-lg rounded-lg shadow-lg hover:bg-gray-200 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            保存
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
