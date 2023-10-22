const jwt = require("jsonwebtoken");

exports.sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY || "P@ssw0rd", {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

exports.verify = (token) =>
  jwt.verify(token, process.env.JWT_SECRET_KEY || "P@ssw0rd");
