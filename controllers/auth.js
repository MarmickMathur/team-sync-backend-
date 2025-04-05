const prisma = require("../utility/prismaLoader");
const { hashPassword, checkPassword } = require("../utility/bcryptUtil");

module.exports = {
  signup: async (req, res) => {
    const { password, email } = req.body;
    const hashPass = await hashPassword(password, 10);
    try {
      const newUser = await prisma.user.create({
        data: {
          password: hashPass,
          email,
        },
      });
      res.send("ok user created");
      return;
    } catch (error) {
      console.log(error);
      res.send("user not saved");
      return;
    }
    res.send("error");
  },
  login: async (req, res) => {
    try {
      const { password, email } = req.body;
      const userFound = await prisma.user.findUnique({ where: { email } });
      if (!userFound) {
        res.send("no such user");
      }
      const match = await checkPassword(password, userFound.password);
      res.send(match);
      return;
    } catch (error) {
      console.log(error);
      res.send(error);
      return;
    }
    res.send("error");
  },
};
