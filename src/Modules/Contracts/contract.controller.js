const Connection = require("../../database/connection")
const JWT = require("jsonwebtoken")
require("dotenv").config()

const ALLOWED_STATUS = ['ativo', 'inativo', 'concluido'];

const Contract = {
  async create(req, res, next) {
    try {
      const { Title, Description, Status, Value } = req.body;
      if (!Title || !Description || !Status || !Value) { return res.status(400).json({ message: "Faltam dados: {Title, Description, Status, Value}" }); }
      if (typeof Title !== "string") { return res.status(400).json({ message: "Title deve ser uma string." }); }
      if (typeof Description !== "string") { return res.status(400).json({ message: "Description deve ser uma string." }); }
      if (typeof Status !== "string") { return res.status(400).json({ message: "Status deve ser uma string." }); }
      if (typeof Value !== "number" || Number.isNaN(Value)) { return res.status(400).json({ message: "Value deve ser um número." });}
      
      if (!ALLOWED_STATUS.includes(Status)) {
        return res.status(400).json({ message: "Status inválido." });
      }

      const [result] = await Connection.query(
        "SELECT id FROM contracts WHERE title = ? AND user_id = ?",
        [Title, req.userId]
      );
      if (result.length > 0) {
        return res.status(409).json({ message: "Você já tem um contrato com esse título." });
      }

      await Connection.query(
        "INSERT INTO contracts (user_id, title, description, status,value) VALUES (?, ?, ?, ?,?)",
        [req.userId, Title, Description, Status, Value]
      );
      return res.status(201).json({ message: "Contrato criado!" });
    } catch (err) {
      return next(err);
    }
  },

  async edit(req, res, next) {
    try {
      const { id, Title, Description, Status ,Value} = req.body;
      if (!id || !Title || !Description || !Status || !Value) {
        return res.status(400).json({ message: "Faltam dados: {id, Title, Description, Status, Value}" });
      }
      if (typeof Title !== "string") { return res.status(400).json({ message: "Title deve ser uma string." }); }
      if (typeof Description !== "string") { return res.status(400).json({ message: "Description deve ser uma string." }); }
      if (typeof Status !== "string") { return res.status(400).json({ message: "Status deve ser uma string." }); }
      if (typeof Value !== "number" || Number.isNaN(Value)) { return res.status(400).json({ message: "Value deve ser um número." });}
      
      if (!ALLOWED_STATUS.includes(Status)) {
        return res.status(400).json({ message: "Status inválido." });
      }

      const [result] = await Connection.query(
        "UPDATE contracts SET title=?, description=?, status=?, value=? WHERE id=? AND user_id=?",
        [Title, Description, Status, Value, id, req.userId]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Contrato não encontrado ou sem permissão." });
      }
      return res.json({ message: "Contrato editado!" });
    } catch (err) {
      return next(err);
    }
  },

  async del(req, res, next) {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: "Falta o dado: {id}" });
      }

      const [result] = await Connection.query(
        "DELETE FROM contracts WHERE id = ? AND user_id = ?",
        [id, req.userId]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Contrato não encontrado ou sem permissão." });
      }
      return res.json({ message: "Contrato removido!" });
    } catch (err) {
      return next(err);
    }
  },

  async search(req, res, next) {
    try {
      const [results] = await Connection.query("SELECT * FROM contracts where status IN ('ativo','concluido')");
      return res.json(results);
    } catch (err) {
      return next(err);
    }
  },

  async profile(req, res, next) {
    try {
      const [results] = await Connection.query(
        "SELECT * FROM contracts WHERE user_id = ?",
        [req.userId]
      );
      return res.json(results);
    } catch (err) {
      return next(err);
    }
  }
};

module.exports = Contract

