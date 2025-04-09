const prisma = require("../utility/prismaLoader");

module.exports = {
  addTicket: async (req, res) => {
    const ticket = await prisma.ticket.create({
      data: req.body,
    });
  },
};
