const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

function auth(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
}

module.exports = auth;
