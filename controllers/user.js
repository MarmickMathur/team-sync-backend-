const prisma = require("../utility/prismaLoader");
const { hashPassword, checkPassword } = require("../utility/bcryptUtil");
const { generateToken } = require("../utility/jwt");
const { getOrganization } = require("./organization");

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
  getOrganization: async (req, res) => {
    const uid = req.user.id;
    const orgs = prisma.UserOrganization.findMany({
      where: {
        userId: uid,
      },
    });
  },
};
