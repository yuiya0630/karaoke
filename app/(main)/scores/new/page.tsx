"use client";

export default function ScoreInputPage() {
  return (
    <div className="flex justify-center items-center min-h-screen text-black">
      <div className="w-full max-w-lg p-8 rounded-xl shadow-lg border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold">採点データ入力</h1>
        </div>

        <form className="space-y-6">
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
              name="score"
              min="0"
              max="100"
              placeholder="e.g. 95"
              className="mt-1 block w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-200 text-white"
            />
          </div>

          {/* 歌手名入力欄 */}
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
              name="artist"
              placeholder="e.g. Ado"
              className="mt-1 block w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-200 text-white"
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
              name="songTitle"
              placeholder="e.g. 新時代"
              className="mt-1 block w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-200 text-white"
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
              name="comment"
              rows={4}
              placeholder="e.g. Almost perfect score!"
              className="mt-1 block w-full px-4 py-3  border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-200 resize-none text-white"
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
