const prisma = require("../utility/prismaLoader");

module.exports = {
  getOrgRole: async (user_id, org_id) => {
    const { role } = await prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: user_id,
          organizationId: org_id,
        },
      },
    });
    console.log(role);
    return role;
  },
  getTeamRole: async (user_id, team_id) => {},
};
