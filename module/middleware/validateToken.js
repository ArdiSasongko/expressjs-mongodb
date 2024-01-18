const asyncHandler = require("express-async-handler");
const Response = require("../model/response")
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    if (!token) {
        const response = new Response.Error(true, 404, "Token not found")
        return res.status(404).json(response)
    }

    jwt.verify(token, process.env.KEY, (err, decode) => {
      if (err) {
        const response = new Response.Error(true, 401, "User Unauthorized")
        return res.status(401).json(response)
      }
      req.user = decode.user;
      next();
    });
  } else {
    const response = new Response.Error(true, 401, "Header Authorization not valid")
    return res.status(401).json(response)
  }
});

module.exports = validateToken;
