const prisma = require("./utility/prismaLoader");
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const app = express();
const auth = require("./routes/auth");
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/test", (req, res) => {
  res.status(200);
  res.send("route working");
});

app.use("/", auth);
app.use("/", () => {
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
