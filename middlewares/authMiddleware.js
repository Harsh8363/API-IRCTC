const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, "harshit");
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
