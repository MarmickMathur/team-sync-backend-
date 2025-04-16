const { PrismaClient } = require("@prisma/client");

let prisma;

if (!global.prisma) {
  // Create base client
  const basePrisma = new PrismaClient();

  // Add extensions
  global.prisma = basePrisma.$extends({
    name: "TicketLoggingExtension",
    model: {
      ticket: {
        async createWithLog(data) {
          const ticket = await basePrisma.ticket.create({ data });

          await basePrisma.ticketLog.create({
            data: {
              actionType: "CREATE",
              snapshot: ticket,
              ticketId: ticket.id,
              actorId: data.creator_id || data.creator, // Handle both field names
            },
          });

          return ticket;
        },

        async updateWithLog(params) {
          const { where, data } = params;
          const oldTicket = await basePrisma.ticket.findUniqueOrThrow({
            where,
          });
          const { updatedById } = data;
          delete data.updatedById;
          const updatedTicket = await basePrisma.ticket.update({
            where,
            data: {
              ...data,
              updatedById: updatedById || null,
            },
          });

          await basePrisma.ticketLog.create({
            data: {
              actionType: "UPDATE",
              snapshot: updatedTicket,
              changes: {
                old: oldTicket,
                new: updatedTicket,
              },
              ticketId: updatedTicket.id,
              actorId: updatedById || oldTicket.updatedById || null,
            },
          });

          return updatedTicket;
        },

        async deleteWithLog(params) {
          const { where, data } = params;
          const ticket = await basePrisma.ticket.findUniqueOrThrow({ where });
          const actor = data.deletedById;
          await basePrisma.ticket.delete({ where });

          await basePrisma.ticketLog.create({
            data: {
              actionType: "DELETE",
              snapshot: ticket,
              ticketId: where.id,
              actorId: actor || ticket.updatedById || null,
            },
          });

          return ticket;
        },
      },
    },
  });
}

prisma = global.prisma;

module.exports = prisma;
