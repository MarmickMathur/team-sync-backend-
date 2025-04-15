const prisma = require("../utility/prismaLoader");

async function verifyTeam(req, res, next) {
  try {
    const uid = req.user.id;
    const tid = req.query.team_id;
    const result = await prisma.TeamUser.findFirst({
      where: {
        teamId: tid,
        role: "lead", // checking for the creator (owner)
      },
      include: {
        user: true, // get creator's user info
        team: true, // get the organization info
      },
    });
    // console.log(result);
    if (result) {
      const { user, team } = result;
      if (user.id == uid) {
        req.team = team;
        next();
        return;
      }
    }

    const commonOrg = await prisma.organization.findFirst({
      where: {
        members: {
          some: {
            userId: uid,
            role: { in: ["admin", "owner"] },
          },
        },
        teams: {
          some: {
            teamId: tid,
          },
        },
      },
    });

    if (commonOrg) {
      const team = await prisma.team.findFirst({
        where: {
          id: tid,
        },
      });
      req.team = team;
      next();
    } else {
      console.log("here");
      throw new Error("user not authorized");
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "authorization nahi hai" });
  }
}

module.exports = verifyTeam;
