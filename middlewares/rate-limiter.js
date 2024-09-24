const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 50,
  message:
    "You have sent too many requests to the server, please try again later.",
});

module.exports = apiLimiter;
