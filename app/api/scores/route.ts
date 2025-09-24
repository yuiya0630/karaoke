import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // フロントエンドから送られてきたデータを取得
    const body = await request.json();
    const { score, artist, songTitle } = body;

    // ----- データベースへの保存処理 -----

    // 1. まず、同じアーティスト名と曲名の曲が既に存在するかチェック
    let song = await prisma.song.findFirst({
      where: {
        artist: artist,
        title: songTitle,
      },
    });

    // 2. もし曲が存在しなければ、新しくSongテーブルに登録する
    if (!song) {
      song = await prisma.song.create({
        data: {
          artist: artist,
          title: songTitle,
        },
      });
    }

    // 3. Scoreテーブルに新しい採点データを登録する
    //    song.id を使って曲とスコアを紐付ける
    //    ※ user_id は将来的にログイン機能を作った際に、ログイン中のユーザーIDを入れる
    await prisma.score.create({
      data: {
        score: Number(score), // 数値に変換
        song_id: song.id,
        user_id: 1, // とりあえず仮でユーザーIDを1に設定
      },
    });

    // 成功したことをフロントエンドに伝える
    return NextResponse.json(
      { message: "データが保存されました" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    // エラーが発生したことをフロントエンドに伝える
    return NextResponse.json(
      { error: "データの保存に失敗しました" },
      { status: 500 }
    );
  }
}
