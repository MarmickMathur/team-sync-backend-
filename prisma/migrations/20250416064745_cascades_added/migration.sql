-- DropForeignKey
ALTER TABLE "TicketLog" DROP CONSTRAINT "TicketLog_ticketId_fkey";

-- AddForeignKey
ALTER TABLE "TicketLog" ADD CONSTRAINT "TicketLog_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
