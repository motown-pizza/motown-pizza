/*
  Warnings:

  - You are about to drop the column `verfication_code` on the `deliveries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "deliveries" DROP COLUMN "verfication_code",
ADD COLUMN     "verification_code" TEXT;
