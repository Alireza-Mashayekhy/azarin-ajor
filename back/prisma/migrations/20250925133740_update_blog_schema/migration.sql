/*
  Warnings:

  - You are about to drop the column `author` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `BlogPostTranslation` table. All the data in the column will be lost.
  - You are about to drop the `_BlogCategoryToBlogPost` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `BlogPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_BlogCategoryToBlogPost" DROP CONSTRAINT "_BlogCategoryToBlogPost_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_BlogCategoryToBlogPost" DROP CONSTRAINT "_BlogCategoryToBlogPost_B_fkey";

-- AlterTable
ALTER TABLE "public"."BlogPost" DROP COLUMN "author",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."BlogPostTranslation" DROP COLUMN "summary",
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT;

-- DropTable
DROP TABLE "public"."_BlogCategoryToBlogPost";

-- AddForeignKey
ALTER TABLE "public"."BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogPost" ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."BlogCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
