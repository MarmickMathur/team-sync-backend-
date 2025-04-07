/*
  Warnings:

  - You are about to drop the `TeamOraganization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TeamOraganization" DROP CONSTRAINT "TeamOraganization_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "TeamOraganization" DROP CONSTRAINT "TeamOraganization_teamId_fkey";

-- DropTable
DROP TABLE "TeamOraganization";

-- CreateTable
CREATE TABLE "TeamOrganization" (
    "teamId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamOrganization_pkey" PRIMARY KEY ("teamId","organizationId")
);

-- AddForeignKey
ALTER TABLE "TeamOrganization" ADD CONSTRAINT "TeamOrganization_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamOrganization" ADD CONSTRAINT "TeamOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
