const prisma = require("../utility/prismaLoader");

module.exports = {
  getTeamRole: async (user_id, team_id) => {
    const { role } = await prisma.teamUser.findUnique({
      where: {
        userId_teamId: {
          userId: user_id,
          teamId: team_id,
        },
      },
    });
    console.log(role);
    return role;
  },
};
