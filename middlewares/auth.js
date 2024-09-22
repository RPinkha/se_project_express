const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-err");

const handleAuthError = (res, next) => {
  next(new UnauthorizedError("Authorization required"));
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res, next);
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res, next);
  }
  req.user = payload;
  next();
  return undefined;
};
