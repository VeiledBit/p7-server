const jwt = require("jsonwebtoken");

const jwtSecret = process.env.SUPABASE_AUTH_SECRET;

const verifyTokenFull = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, (error, decoded) => {
    if (error) {
      return res.status(401).json(error);
    }
    req.user = decoded;
    next();
  });
};

const verifyTokenPartial = (req, res, next) => {
  const token = req.headers.authorization;
  req.partial = false;

  if (!token) {
    req.partial = true;
    next();
  } else {
    jwt.verify(token.split(" ")[1], jwtSecret, (error, decoded) => {
      if (error) {
        req.partial = true;
        next();
        return;
      }
      req.user = decoded;
      next();
    });
  }
};

module.exports = { verifyTokenFull, verifyTokenPartial };
