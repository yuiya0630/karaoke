import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  try {
    const { email, password } = await req.json();

    // 1. 入力値のバリデーション
    if (!email || !password) {
      return NextResponse.json(
        { message: "メールアドレスとパスワードを入力してください。" },
        { status: 400 }
      );
    }

    // 2. 既存ユーザーの確認
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "このメールアドレスは既に使用されています。" },
        { status: 409 } // 競合を示すステータスコード
      );
    }

    // 3. パスワードのハッシュ化
    const hashedPassword = await hash(password, 10);

    // 4. データベースへのユーザー登録
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        // ここに他の必要なフィールド
      },
    });

    // 5. 成功レスポンスの返却
    return NextResponse.json(
      { message: "ユーザー登録が完了しました。", userId: newUser.id },
      { status: 201 } // 作成成功を示すステータスコード
    );
  } catch (error) {
    console.error("ユーザー登録エラー:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
