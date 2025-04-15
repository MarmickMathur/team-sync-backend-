const user = require("../controllers/user");
const prisma = require("../utility/prismaLoader");

async function verifyTicket(req, res, next) {
  try {
    const uid = req.user.id;
    const tid = req.query.ticket_id;
    const result = await prisma.Ticket.findFirst({
      where: {
        id: tid,
      },
      include: {
        creator_id: true, // get creator's user info
        assinged_to: true, // get the organization info
      },
    });
    // console.log(result);
    if (result) {
      const { creator, assigned } = result;
      if (uid == creator.id || user.id == assigned.id) {
        // req.ticket = result;
        next();
        return;
      } else {
        throw new Error("authorization nahi hai");
      }
    }
    throw new Error("ticket nahi hia aisa kuch ");
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: err.message });
  }
}

module.exports = verifyTicket;
