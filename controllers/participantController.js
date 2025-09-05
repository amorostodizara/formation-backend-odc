const pool = require("../db");

exports.getAll = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM participants");
  res.json(rows);
};
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM participants WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Participant non trouvé" });
    }
    res.json(rows[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.create = async (req, res) => {
  try {
    const participants = req.body; 
    for (const p of participants) {
      await pool.query(
        "INSERT INTO participants (nom, email, contact) VALUES (?, ?, ?)",
        [p.nom, p.email, p.contact]
      );
    }
    res.json({ message: "Participants insérés avec succès" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Erreur lors de l'insertion multiple" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nom, email, contact } = req.body;
  await pool.query("UPDATE participants SET nom=?, email=?, contact=? WHERE id=?", [nom, email,contact, id]);
  res.json({ id, nom, email, contact });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM participants WHERE id=?", [id]);
  res.json({ message: "Participant supprimé" });
};
