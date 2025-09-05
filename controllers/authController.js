const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const users = req.body; 
    for (const user of users) {
      const hashed = await bcrypt.hash(user.password, 10);
      await pool.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [user.username, hashed]
      );
    }
    res.json({ message: "Utilisateur a été créés" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Erreur lors de l'insertion" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.query("SELECT * FROM users WHERE username=?", [username]);
  const user = rows[0];
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

  const token = jwt.sign({ id: user.id, username }, SECRET_KEY, { expiresIn: "23h" });
  res.json({ token });
};
