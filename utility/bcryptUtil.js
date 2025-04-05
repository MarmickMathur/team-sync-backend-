const bcrypt = require("bcrypt");

module.exports = {
  hashPassword: async (password, saltRounds) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  },
  checkPassword: async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  },
};
