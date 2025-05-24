const jwt = require("jsonwebtoken");
const key = "kunal_29/06/2003";

const jwtAuthMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        status: "fail",
        error: "unauthorized",
      });
    }

    const decoded = jwt.verify(token, key);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      error: "Invalid token",
    });
  }
};

const generateToken = (userdata) => {
  return jwt.sign(userdata, key);
};

module.exports = { jwtAuthMiddleware, generateToken };
