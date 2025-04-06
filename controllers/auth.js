const prisma = require("../utility/prismaLoader");
const { hashPassword, checkPassword } = require("../utility/bcryptUtil");
const { generateToken } = require("../utility/jwt");

module.exports = {
  signup: async (req, res, next) => {
    const { password, email } = req.body;
    console.log("email");
    const hashPass = await hashPassword(password, 10);
    try {
      const newUser = await prisma.user.create({
        data: {
          password: hashPass,
          email,
        },
      });
      // res.send("ok created");
      delete newUser.password;
      const token = generateToken(newUser);
      res.json({ token });
      next();
    } catch (error) {
      console.log(error);
      res.send("user not saved");
      next();
    }
    res.send("error");
  },
  login: async (req, res, next) => {
    try {
      const { password, email } = req.body;
      const userFound = await prisma.user.findUnique({ where: { email } });
      if (!userFound) {
        res.send("no such user");
      }
      const match = await checkPassword(password, userFound.password);
      if (match) {
        delete userFound.password;
        const token = generateToken(userFound);
        res.json({ token });
      } else {
        res.send("invalid credentials");
      }
      next();
    } catch (error) {
      console.log(error);
      res.send(error);
      next();
    }
    res.send("error");
  },
};
