const prisma = require("../utility/prismaLoader");
const { hashPassword, checkPassword } = require("../utility/bcryptUtil");
const { generateToken } = require("../utility/jwt");

module.exports = {
  patchUser: async (req, res) => {
    try {
      const foundUser = await prisma.user.findUnique({
        where: { id: req.user.id },
      });
      console.log(foundUser);
      if ((await checkPassword(req.body.password, foundUser.password)) == 0) {
        req.body.password = await hashPassword(req.body.password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id: foundUser.id },
        data: req.body,
      });
      delete updatedUser.password;
      const token = generateToken(updatedUser);
      res.json({ token });
    } catch (error) {
      console.error("User not found or update failed:", error);
    }
  },

  //incomplete route
  getOrganization: async (req, res) => {
    const uid = req.user.id;
    try {
      const { organizations } = await prisma.user.findUnique({
        where: {
          id: uid,
        },
        include: {
          organizations: {
            include: {
              organization: true,
            },
          },
        },
      });
      const result = organizations.map((item) => ({
        organization: item.organization,
        role: item.role,
      }));

      res.json(result);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

  addOrganization: async (req, res) => {
    const { organization_name, user_id } = req.body;
    try {
      const newOrganization = await prisma.organization.create({
        data: {
          name: organization_name,
          members: {
            create: {
              user: {
                connect: { id: user_id },
              },
              role: "owner",
            },
          },
        },
      });

      res.status(400).json({
        organization_id: newOrganization.id,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("error ho gaya");
    }
  },

  getTeams: async (req, res) => {
    const uid = req.user.id;
    try {
      const { teams } = await prisma.user.findUnique({
        where: {
          id: uid,
        },
        include: {
          teams: {
            include: {
              team: true,
            },
          },
        },
      });
      const result = teams.map((item) => ({
        team: item.team,
        role: item.role,
      }));
      res.json(result);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },
  getUserFromEmail: async (req, res) => {
    const { email } = req.params;
    console.log(email);
    try {
      const user = await prisma.User.findUnique({
        where: { email },
      });
      console.log(user);
      delete user.password;
      if (!user) throw Error("user not found");
      res.json(user);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },

  //test this pls
  addTeam: async (req, res) => {
    const { team_name, user_id } = req.body;
    try {
      const newTeam = await prisma.organization.create({
        data: {
          name: team_name,
          members: {
            create: {
              user: {
                connect: { id: user_id },
              },
              role: "lead",
            },
          },
        },
      });

      res.status(400).json({
        team_id: newTeam.id,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("error ho gaya");
    }
  },
};
