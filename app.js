const prisma = require("./utility/prismaLoader");
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const app = express();
const auth = require("./routes/auth");
const user = require("./routes/user");
const orgs = require("./routes/organization");
const team = require("./routes/team");
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const authMiddleware = require("./middleware/jwtmiddleware");

app.use("/test", (req, res) => {
  res.status(200);
  res.send("route working");
});

app.use("/", auth);
app.use("/user", user);
app.use("/organization", orgs);
app.use("/team", team);

app.get("/testProtected", authMiddleware, (req, res) => {
  res.send("protected route working");
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("not found");
});

main = async () => {};

try {
  main();
} catch (error) {
  console.log(error);
} finally {
  prisma.$disconnect();
}

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
