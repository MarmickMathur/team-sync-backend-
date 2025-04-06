/*
  Warnings:

  - You are about to drop the column `leaderId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `_teamRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OrganizationRoles" AS ENUM ('owner', 'admin', 'member');

-- CreateEnum
CREATE TYPE "TeamRoles" AS ENUM ('lead', 'member', 'external_contributor');

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_leaderId_fkey";

-- DropForeignKey
ALTER TABLE "_teamRelation" DROP CONSTRAINT "_teamRelation_A_fkey";

-- DropForeignKey
ALTER TABLE "_teamRelation" DROP CONSTRAINT "_teamRelation_B_fkey";

-- DropIndex
DROP INDEX "Team_leaderId_key";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "leaderId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT;

-- DropTable
DROP TABLE "_teamRelation";

-- CreateTable
CREATE TABLE "TeamUser" (
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "role" "TeamRoles" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamUser_pkey" PRIMARY KEY ("userId","teamId")
);

-- CreateTable
CREATE TABLE "TeamOraganization" (
    "teamId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamOraganization_pkey" PRIMARY KEY ("teamId","organizationId")
);

-- CreateTable
CREATE TABLE "UserOrganization" (
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "OrganizationRoles" NOT NULL,

    CONSTRAINT "UserOrganization_pkey" PRIMARY KEY ("userId","organizationId")
);

-- AddForeignKey
ALTER TABLE "TeamUser" ADD CONSTRAINT "TeamUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamUser" ADD CONSTRAINT "TeamUser_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamOraganization" ADD CONSTRAINT "TeamOraganization_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamOraganization" ADD CONSTRAINT "TeamOraganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
