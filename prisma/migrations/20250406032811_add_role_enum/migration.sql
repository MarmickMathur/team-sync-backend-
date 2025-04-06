-- CreateEnum
CREATE TYPE "Status" AS ENUM ('to_do', 'in_progress', 'approval', 'done');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" TIMESTAMP(3),
    "creator" TEXT NOT NULL,
    "assigned" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assigned_fkey" FOREIGN KEY ("assigned") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
