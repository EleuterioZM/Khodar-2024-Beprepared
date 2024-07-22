/*
  Warnings:

  - Added the required column `province_id` to the `subscribers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscribers" ADD COLUMN     "province_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
