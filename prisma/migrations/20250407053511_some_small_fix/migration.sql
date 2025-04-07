/*
  Warnings:

  - You are about to drop the `_Organizations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Organizations" DROP CONSTRAINT "_Organizations_A_fkey";

-- DropForeignKey
ALTER TABLE "_Organizations" DROP CONSTRAINT "_Organizations_B_fkey";

-- DropTable
DROP TABLE "_Organizations";
