const prisma = require("../utility/prismaLoader");

module.exports = {
  getOrganization: (req, res) => {
    console.log("middleware working");
    res.json(req.organization);
  },

  //incomplete route
  getTeams: async (req, res) => {
    console.log("getting teams");
    const oid = req.body.organization_id;
    try {
      const teams = await prisma.Organization.findFirst({
        where: {
          id: oid,
        },
        include: {
          teams: true,
        },
      });

      console.log(teams);
      res.json(teams);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  addTeam: async (req, res) => {
    try {
      const newTeam = await prisma.Team.create({
        data: {
          name: req.body.name,
        },
      });
      console.log(newTeam);
      const updatedOrg = await prisma.organization.update({
        where: {
          id: req.organization.id,
        },
        data: {
          teams: {
            create: {
              team: {
                connect: { id: newTeam.id },
              },
            },
          },
        },
      });
      res.json(newTeam);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
};
