const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  // console.log(req.cookies);
  try {
    const { authToken } = req.cookies;
    if (!authToken)
      return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(authToken, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
