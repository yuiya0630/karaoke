"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function ScoresPage() {
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー（ログアウトボタン付き） */}
      <header className="flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">スコア履歴</h1>
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
      
      <div className="p-4">
        <p className="text-gray-600">スコア履歴機能は開発中です。</p>
      </div>
    </div>
  );
}

export default ScoresPage;
