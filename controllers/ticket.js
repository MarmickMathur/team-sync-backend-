const prisma = require("../utility/prismaLoader");

module.exports = {
  getlogs: async (req, res) => {},
  getTicket: async (req, res) => {
    try {
      const ticket = await prisma.ticket.findFirst({
        where: {
          id: req.query.ticket_id,
        },
        include: {
          creator_id: true,
          assigned_to: true,
          team: true,
        },
      });
      delete ticket.creator_id.password;
      delete ticket.assigned_to.password;
      res.json(ticket);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  addTicket: async (req, res) => {
    try {
      const ticket = await prisma.ticket.createWithLog(req.body);
      res.json(ticket);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
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
      console.log(req.body.ticket_id);
      const ticket_id = req.body.ticket_id;
      delete req.body.ticket_id;
      const ticket = await prisma.ticket.updateWithLog({
        where: {
          id: ticket_id,
        },
        data: {
          ...req.body,
          updatedById: req.user.id, // required for logging
        },
      });
      res.json(ticket);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
};
