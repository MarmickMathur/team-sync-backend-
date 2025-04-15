const prisma = require("../utility/prismaLoader");

module.exports = {
  getTicket: async (req, res) => {
    try {
      const ticket = await prisma.ticket.findFirst({
        where: {
          id: req.query.ticket_id,
        },
      });
      res.json(ticket);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  addTicket: async (req, res) => {
    try {
      const ticket = await prisma.ticket.create({
        data: req.body,
      });

      res.json(ticket);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  delTicket: async (req, res) => {
    try {
      const ticket = await prisma.ticket.delete({
        where: {
          id: req.body.ticket_id,
        },
      });
      res.json(ticket);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  patchTicket: async (req, res) => {
    try {
      console.log(req.body.id);
      const ticket = await prisma.ticket.update({
        where: {
          id: req.body.id,
        },
        data: req.body,
      });
      res.json(ticket);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
};
