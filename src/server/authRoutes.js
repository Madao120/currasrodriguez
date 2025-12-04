import { login, verificarToken, soloAdmin } from "./authController.js";
import express from "express";

const router = express.Router();

router.post("/login", login);

router.get("/modelos", verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Hola ${req.user.dni}, estas autentificado.` });
});

router.get("/clientes", verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Hola ${req.user.dni}, estas autentificado.` });
});

router.get("/ventas", verificarToken, (req, res) => {
  res.json({ message: `Hola ${req.user.dni}, estas autentificado.` });
});

router.get("/noticias", verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Hola ${req.user.dni}, estas autentificado.` });
});

router.get("/citasTaller", verificarToken, (req, res) => {
  res.json({ message: `Hola ${req.user.dni}, estas autentificado.` });
});

// Devuelve si el usuario es admin

export default router;
