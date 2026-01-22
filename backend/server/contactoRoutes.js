import express from "express";
import { Resend } from "resend";

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  try {
    const result = await resend.emails.send({
      from: "Contacto <onboarding@resend.dev>",
      to: "madaomc120@gmail.com",
      subject: asunto || `Nuevo mensaje de ${nombre}`,
      html: `
                <h2>Nuevo mensaje desde el formulario</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Asunto:</strong> ${asunto}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${mensaje}</p>
            `,
    });

    res.json({
      success: true,
      id: result.id,
    });
  } catch (error) {
    console.error("Error enviando email desde backend:", error);
    res.status(500).json({ success: false, error: error.message || "No se pudo enviar el email" });
  }
});

export default router;
