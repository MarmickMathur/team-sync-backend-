const prisma = require("./utility/prismaLoader");
const cors = require("cors");
const cookieParse = require("cookie-parser");
require("dotenv").config();
const express = require("express");
const app = express();
const auth = require("./routes/auth");
const user = require("./routes/user");
const orgs = require("./routes/organization");
const team = require("./routes/team");
const ticket = require("./routes/ticket");
const port = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParse());
app.use(
  cors({
    origin: true,
    allowedHeaders: ["Content-Type"],
    credentials: true,
    method: ["GET", "POST", "PUT", "DELETE"],
  })
);
const authMiddleware = require("./middleware/jwtmiddleware");

app.use("/test", (req, res) => {
  res.status(200);
  res.send("route working");
});

app.use("/", auth);
app.get('/logout', (req, res) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  };
	res.status(200).cookie('authToken', 'none', options).json({'message': "Successfully logged out"});
});
app.use("/user", user);
app.use("/organization", orgs);
app.use("/team", team);
app.use("/ticket", ticket);

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
