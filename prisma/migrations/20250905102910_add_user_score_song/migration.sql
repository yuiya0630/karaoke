-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Score" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "score_picture" TEXT,
    "user_id" INTEGER NOT NULL,
    "song_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Song" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Score" ADD CONSTRAINT "Score_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Score" ADD CONSTRAINT "Score_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
