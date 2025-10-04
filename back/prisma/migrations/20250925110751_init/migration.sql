-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "areaPerUnit" DOUBLE PRECISION,
ADD COLUMN     "heightMm" INTEGER,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "thicknessMm" INTEGER,
ADD COLUMN     "unitsPerBox" INTEGER,
ADD COLUMN     "widthMm" INTEGER;

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "mainAddressId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Address" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "label" TEXT,
    "country" TEXT,
    "province" TEXT,
    "city" TEXT,
    "street" TEXT,
    "postalCode" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogPost" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "coverImage" TEXT,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogPostTranslation" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "blogPostId" INTEGER NOT NULL,

    CONSTRAINT "BlogPostTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogCategory" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogCategoryTranslation" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "BlogCategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cart" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CartItem" (
    "id" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Favorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER,
    "blogPostId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER,
    "productId" INTEGER,
    "blogPostId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_BlogCategoryToBlogPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BlogCategoryToBlogPost_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_mainAddressId_key" ON "public"."User"("mainAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "public"."BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPostTranslation_locale_blogPostId_key" ON "public"."BlogPostTranslation"("locale", "blogPostId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "public"."BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategoryTranslation_locale_categoryId_key" ON "public"."BlogCategoryTranslation"("locale", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "public"."Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_productId_key" ON "public"."Favorite"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_blogPostId_key" ON "public"."Favorite"("userId", "blogPostId");

-- CreateIndex
CREATE INDEX "Comment_productId_idx" ON "public"."Comment"("productId");

-- CreateIndex
CREATE INDEX "Comment_blogPostId_idx" ON "public"."Comment"("blogPostId");

-- CreateIndex
CREATE INDEX "_BlogCategoryToBlogPost_B_index" ON "public"."_BlogCategoryToBlogPost"("B");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_mainAddressId_fkey" FOREIGN KEY ("mainAddressId") REFERENCES "public"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogPostTranslation" ADD CONSTRAINT "BlogPostTranslation_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "public"."BlogPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogCategoryTranslation" ADD CONSTRAINT "BlogCategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."BlogCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "public"."BlogPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "public"."BlogPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BlogCategoryToBlogPost" ADD CONSTRAINT "_BlogCategoryToBlogPost_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BlogCategoryToBlogPost" ADD CONSTRAINT "_BlogCategoryToBlogPost_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
