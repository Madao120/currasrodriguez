// routes/contacto.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Resend } from "resend";

const router = express.Router();
console.log("API Key Resend:", process.env.RESEND_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

//router
router.post("/", async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;
  try {
    const response = await resend.emails.send({
      from: "Contacto <onboarding@resend.dev>",
      to: ["madaomc120@gmail.com"],
      subject: asunto || "Nuevo mensaje de contacto",
      html: `
            <h2>Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Asunto:</strong> ${asunto}</p>
            <p><strong>Mensaje:</strong></p> 
            <p>${mensaje}</p>
        
        `,
    });

    res.json({ ok: true, id: response.id });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ ok: false, error: "Error al enviar el correo" });
  }
});

export default router;
