import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { compare } from "bcrypt";
import { PrismaClient } from "../../../generated/prisma"; // PrismaClientをインポート

const prisma = new PrismaClient(); // PrismaClientのインスタンスを作成
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "メールアドレスとパスワードを入力してください。" },
        { status: 400 }
      );
    }

    // 2. Prismaを使ってデータベースからユーザーを検索
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // ユーザーが見つからない場合
    if (!user) {
      return NextResponse.json(
        { message: "メールアドレスまたはパスワードが正しくありません。" },
        { status: 401 }
      );
    }

    // 3. パスワードの照合 (user.passwordHash -> user.password)
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "メールアドレスまたはパスワードが正しくありません。" },
        { status: 401 }
      );
    }

    // 4. JWTトークンの生成 (user.idは数値なので文字列に変換)
    const token = await new SignJWT({
      userId: String(user.id),
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    // 5. トークンをレスポンスとして返す
    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
