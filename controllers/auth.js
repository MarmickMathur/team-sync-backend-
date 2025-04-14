const prisma = require("../utility/prismaLoader");
const { hashPassword, checkPassword } = require("../utility/bcryptUtil");
const { generateToken } = require("../utility/jwt");

module.exports = {
  signup: async (req, res, next) => {
    console.log(req.body);
    const { password, email, name } = req.body;
    console.log("email");
    const hashPass = await hashPassword(password, 10);
    try {
      const newUser = await prisma.user.create({
        data: {
          password: hashPass,
          email,
          
          name: name??null
        },
      });
      // res.send("ok created");
      delete newUser.password;
      const token = generateToken(newUser);
      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      };
      res.status(200).cookie("authToken", token, options).json(newUser);
      next();
    } catch (error) {
      console.log(error);
      res.send("user not saved");
      next();
    }
    res.send("error");
  },
  login: async (req, res, next) => {
    console.log(req.body);
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
        const options = {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        };
        res.status(200).cookie("authToken", token, options).json(userFound);
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
