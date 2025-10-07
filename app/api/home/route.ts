import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

/**
 * ホーム画面に必要なデータを取得するAPIエンドポイント
 * GET /api/home
 */
export async function GET() {
  try {
    // 認証機能が実装されるまで、一時的にユーザーIDを1に固定します
    const userId = 1;

    // 1. 最新の採点結果を1件取得
    // 関連する楽曲情報（曲名、アーティスト名）も同時に取得します
    const latestScore = await prisma.score.findFirst({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc", // created_atカラムで降順に並び替え、最新のものを取得
      },
      include: {
        song: {
          select: {
            title: true,
            artist: true,
          },
        },
      },
    });

    // 採点結果が存在しない場合はデフォルトデータを返す
    if (!latestScore) {
      return NextResponse.json({
        latestScore: {
          score: 0,
          songTitle: "データなし",
          artist: "データなし",
          comment: "まだ採点データがありません。最初の採点を始めましょう！",
        },
        stats: {
          average: 0,
          highest: 0,
          lowest: 0,
        },
      });
    }

    // 2. ユーザーのスコア統計情報（平均、最高、最低）を取得
    const stats = await prisma.score.aggregate({
      where: {
        user_id: userId,
      },
      _avg: {
        score: true,
      },
      _max: {
        score: true,
      },
      _min: {
        score: true,
      },
    });

    // フロントエンドが必要とする形式にデータを整形して返却
    const responseData = {
      latestScore: {
        score: latestScore.score,
        songTitle: latestScore.song.title,
        artist: latestScore.song.artist,
        comment: latestScore.comment || "コメントはありません",
      },
      stats: {
        average: stats._avg.score || 0,
        highest: stats._max.score || 0,
        lowest: stats._min.score || 0,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("ホーム画面データの取得に失敗しました", error);
    // エラー詳細をログに出力し、クライアントには汎用的なエラーメッセージを返す
    return NextResponse.json(
      { error: "データの取得に失敗しました" },
      { status: 500 }
    );
  }
}