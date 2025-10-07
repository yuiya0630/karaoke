import { prisma } from "../lib/prisma";

async function createTestData() {
  try {
    // テストユーザーを作成
    const user = await prisma.user.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        email: "test@example.com",
        password: "hashedpassword",
      },
    });

    console.log("テストユーザーを作成しました:", user);

    // テスト楽曲を作成
    const songs = await Promise.all([
      prisma.song.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          title: "summersong",
          artist: "yui",
        },
      }),
      prisma.song.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          title: "残酷な天使のテーゼ",
          artist: "高橋洋子",
        },
      }),
      prisma.song.upsert({
        where: { id: 3 },
        update: {},
        create: {
          id: 3,
          title: "津軽海峡冬景色",
          artist: "石川さゆり",
        },
      }),
    ]);

    console.log("テスト楽曲を作成しました:", songs);

    // テストスコアを作成
    const scores = await Promise.all([
      prisma.score.create({
        data: {
          user_id: 1,
          song_id: 1,
          score: 90.5,
          comment:
            "感情の込め方がピカイチです。あなたのこの曲に対する想いが伝わってくるようでした。",
        },
      }),
      prisma.score.create({
        data: {
          user_id: 1,
          song_id: 2,
          score: 85.2,
          comment: "高音域が綺麗に出ていて素晴らしいです！",
        },
      }),
      prisma.score.create({
        data: {
          user_id: 1,
          song_id: 3,
          score: 92.8,
          comment: "表現力が豊かで感動的な歌声でした。",
        },
      }),
    ]);

    console.log("テストスコアを作成しました:", scores);
    console.log("テストデータの作成が完了しました！");
  } catch (error) {
    console.error("テストデータの作成に失敗しました:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
