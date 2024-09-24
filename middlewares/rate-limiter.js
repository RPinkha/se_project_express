const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message:
    "You have sent too many requests to the server, please try again later.",
});

module.exports = apiLimiter;
