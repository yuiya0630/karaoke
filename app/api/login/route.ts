import { NextResponse } from "next/server";
import { SignJWT } from "jose"; // JWTを生成するためのライブラリ
import { compare } from "bcrypt"; // パスワードを比較するためのライブラリ

// JWTを生成する際の秘密鍵
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. 入力値のバリデーション
    if (!email || !password) {
      return NextResponse.json(
        { message: "メールアドレスとパスワードを入力してください。" },
        { status: 400 }
      );
    }

    // 2. データベースからユーザーを検索
    const user = {
      id: "1",
      email: "test@example.com",
      // bcryptでハッシュ化されたパスワード
      passwordHash:
        "$2b$10$bsXg9vRzg.zv5XPDe7hCuOtV2/nH6bNcRmsBKFGcbi/P9MV7e/q62",
    };

    if (!user) {
      return NextResponse.json(
        { message: "メールアドレスまたはパスワードが正しくありません。" },
        { status: 401 }
      );
    }

    // 3. パスワードの照合
    const isPasswordValid = await compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "メールアドレスまたはパスワードが正しくありません。" },
        { status: 401 }
      );
    }

    // 4. JWTトークンの生成
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h") // トークンの有効期限 (1時間)
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
