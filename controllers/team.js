const { PrivateResultType } = require("@prisma/client/runtime/library");
const { getOrgRole } = require("../utility/orgUtils");
const { getTeamRole } = require("../utility/teamUtils");

const prisma = require("../utility/prismaLoader");

module.exports = {
  getTeam: async (req, res) => {
    const team = await prisma.team.findUnique({
      where: {
        id: req.body.team_id,
      },
    });
    res.json(team);
  },

  addMember: async (req, res) => {
    try {
      const team = await prisma.team.update({
        where: {
          id: req.team.id,
        },
        data: {
          members: {
            create: {
              user: {
                connect: { id: req.body.member_id },
              },
              role: req.body.role,
            },
          },
        },
      });
      res.json(team);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },

  getMembers: async (req, res) => {
    try {
      const { members } = await prisma.team.findUnique({
        where: {
          id: req.body.team_id,
        },
        include: {
          members: true,
        },
      });
      console.log(members);
      res.json(members);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },

  deleteMember: async (req, res) => {
    try {
      const { userId } = await prisma.teamUser.delete({
        where: {
          userId_teamId: {
            userId: req.body.member_id,
            teamId: req.team.id,
          },
        },
      });
      res.json(userId);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },

  patchMember: async (req, res) => {
    try {
      const { userId } = await prisma.teamUser.update({
        where: {
          userId_teamId: {
            userId: req.body.member_id,
            teamId: req.team.id,
          },
        },
        data: {
          role: req.body.role,
        },
      });
      res.json(userId);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
};
