<template>
  <div class="container-fluid my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="d-flex justify-content-center">
          <h2
            class="text-center my-2 bg-`primary-subtle py-1 border bg-primary bg-opacity-25 text-primary p-3 rounded"
          >
            <i class="bi bi-envelope-open"></i> Formulario de Contacto
          </h2>
        </div>
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <form @submit.prevent="enviarFormulario">
              <!--Nombre-->
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  v-model="formulario.nombre"
                  class="form-control"
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <!--Email-->
              <div class="mb-3">
                <label class="form-label">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  v-model="formulario.email"
                  class="form-control"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <!--Asunto-->
              <div class="mb-3">
                <label class="form-label">Asunto</label>
                <input
                  type="text"
                  id="asunto"
                  v-model="formulario.asunto"
                  class="form-control"
                  placeholder="Asunto del mensaje"
                  required
                />
              </div>

              <!--Mensaje-->
              <div class="mb-3">
                <label class="form-label">Mensaje</label>
                <textarea
                  id="mensaje"
                  v-model="formulario.mensaje"
                  class="form-control"
                  rows="5"
                  placeholder="Escribe tu mensaje aquí..."
                  required
                ></textarea>
              </div>

              <!--Botón Enviar-->
              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-primary px-5 py-2"
                  :disabled="enviando"
                >
                  <i class="bi bi-send-fill me-2"></i>
                  {{ enviando ? "Enviando..." : "Enviar" }}
                </button>
              </div>
            </form>
          </div>
          <div class="card-footer d-flex justify-content-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5906.54201227203!2d-8.692645823424254!3d42.25138484195979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2f62e588cfce69%3A0x378485bfa6edd1be!2sIES%20de%20Teis!5e0!3m2!1ses!2ses!4v1765361977695!5m2!1ses!2ses"
              width="600"
              height="450"
              margin="2rem"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            >
            </iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";

const formulario = ref({
  nombre: "",
  email: "",
  asunto: "",
  mensaje: "",
});

const enviando = ref(false);

// Usa variable de entorno si quieres: import.meta.env.VITE_API_URL
const API_URL = "http://localhost:5000/api/contacto";

// --- función corregida ---
const enviarDatosContacto = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const enviarFormulario = async () => {
  enviando.value = true;

  try {
    const response = await enviarDatosContacto(formulario.value);

    if (response?.success) {
      Swal.fire({
        icon: "success",
        title: "¡Mensaje enviado!",
        text: "Gracias por contactarnos. Te responderemos lo antes posible.",
        confirmButtonText: "Aceptar",
      });

      Object.assign(formulario.value, {
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
      });
    } else {
      throw new Error("Respuesta inesperada del servidor");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error al enviar",
      text:
        error.response?.data?.message ||
        "Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.",
      confirmButtonText: "Aceptar",
    });
  } finally {
    enviando.value = false;
  }
};
</script>
