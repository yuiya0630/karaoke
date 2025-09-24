"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      // 1. 新規登録APIにリクエストを送信
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // 2. レスポンスの確認と処理
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "ユーザー登録に失敗しました。");
      }

      // 3. 成功メッセージの表示とリダイレクト
      setMessage("ユーザー登録が完了しました。ログイン画面へ移動します...");

      // `alert`の代わりにカスタムメッセージを表示
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: unknown) {
      // 4. エラーメッセージの表示
      console.error("Registration failed:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("予期せぬエラーが発生しました。");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white border border-gray-200 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          新規登録
        </h1>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* メールアドレス入力フィールド */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/* パスワード入力フィールド */}
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* メッセージとエラーの表示 */}
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          {message && (
            <p className="text-sm text-center text-green-500">{message}</p>
          )}

          {/* 登録ボタン */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "登録中..." : "登録"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
