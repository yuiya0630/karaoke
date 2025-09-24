"use client";

import { useState } from "react"; // useStateをインポート

export default function ScoreInputPage() {
  // 各入力フォームの状態を管理するためのState
  const [score, setScore] = useState("");
  const [artist, setArtist] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [comment, setComment] = useState("");

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
    <div className="flex justify-center items-center min-h-screen text-black">
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
  );
}
