import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// 型定義
interface ArtistRankingItem {
  artist: string;
  _count: {
    id: number;
  };
}

interface ScoreHistoryItem {
  score: number;
}

export async function GET() {
  try {
    console.log("統計API呼び出し開始");

    // ログイン機能がまだなので、仮でuser_id=1のデータを対象とします
    const userId = 1;
    console.log("対象ユーザーID:", userId);

    // データベース接続とデータ存在確認
    const totalScores = await prisma.score.count();
    console.log("全スコア数:", totalScores);

    const userScores = await prisma.score.count({
      where: { user_id: userId },
    });
    console.log("該当ユーザーのスコア数:", userScores);

    // 1. 基本的な統計情報（総数、平均、最大）を一度に計算
    const summary = await prisma.score.aggregate({
      _count: {
        id: true,
      },
      _avg: {
        score: true,
      },
      _max: {
        score: true,
      },
      where: {
        user_id: userId,
      },
    });

    // 2. 点数ランキングTOP5を取得 (Songの情報も一緒に取得)
    const scoreRanking = await prisma.score.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        score: "desc",
      },
      take: 5,
      include: {
        song: true, // 関連するSongのデータ(曲名, アーティスト名)も取得する
      },
    });

    // 3. よく歌うアーティストランキングTOP5を取得
    const artistRanking = await prisma.song.groupBy({
      by: ["artist"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    });

    // 4. グラフ用の時系列データを取得 (最新50件)
    const scoreHistory = await prisma.score.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "asc" },
      take: 50,
      select: {
        score: true,
        created_at: true,
      },
    });

    // フロントエンドに返すデータを整形
    const stats = {
      summary: {
        totalSongs: summary._count.id,
        averageScore: summary._avg.score?.toFixed(2) || 0, // 小数点第2位まで
        maxScore: summary._max.score || 0,
      },
      scoreRanking,
      artistRanking: artistRanking.map((item: ArtistRankingItem) => ({
        artist: item.artist,
        count: item._count.id,
      })),
      scoreHistory: scoreHistory.map(
        (item: ScoreHistoryItem, index: number) => ({
          name: index + 1, // X軸のラベル (e.g., 1回目, 2回目...)
          score: item.score,
        })
      ),
    };

    console.log("統計データ生成完了:", stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("統計データの取得に失敗しました", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("エラー詳細:", errorMessage);
    return NextResponse.json(
      { error: "統計データの取得に失敗しました", details: errorMessage },
      { status: 500 }
    );
  }
}
