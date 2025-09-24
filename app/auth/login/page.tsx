"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ページ遷移のためにimport

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // エラーメッセージ用のstate
  const router = useRouter(); // routerインスタンスを初期化

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // エラーメッセージをリセット

    try {
      // 1. サーバーのログインAPIにリクエストを送信
      const res = await fetch("/api/auth/login", {
        // バックエンドのAPIエンドポイントを指定
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // レスポンスが成功でなければエラーを投げる
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "ログインに失敗しました。");
      }

      // 2. レスポンスからJWTトークンを取得
      const { token } = await res.json();

      // 3. 取得したトークンをlocalStorageに保存
      if (token) {
        localStorage.setItem("token", token);
        console.log("JWT Token:", token);
        alert("ログインに成功しました！");
        // 4. ログイン後、ホームに遷移
        router.push("/");
      } else {
        throw new Error("トークンが取得できませんでした。");
      }
    } catch (err: unknown) {
      // 5. エラーが発生した場合の処理
      console.error("Login failed:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("予期せぬエラーが発生しました。");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white border border-gray-200 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          ログイン
        </h1>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email入力フィールド */}
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
          {/* Password入力フィールド */}
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* エラーメッセージの表示 */}
          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          {/* ログインボタン */}
          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
