<template>
  <div class="container-fluid my-1 p-2 border rounded-0 shadow-sm bg-light">
    <h5 class="text-center bg-primary-subtle py-1">
      <i class="bi bi-envelope-open"></i>Contáctanos
    </h5>
    <p>Texto de prueba</p>
    <form @submit.prevent="enviarMensaje">
      <div class="mb-3">
        <label for="nombre" class="form-label fw-bold">Nombre:</label>
        <input
          type="text"
          id="nombre"
          class="form-control"
          v-model="form.nombre"
          required
        />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label fw-bold">Email:</label>
        <input
          type="email"
          id="email"
          class="form-control"
          v-model="form.email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="mensaje" class="form-label fw-bold">Mensaje:</label>
        <textarea
          id="mensaje"
          class="form-control"
          rows="4"
          v-model="form.mensaje"
          required
        ></textarea>
      </div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary w-50">
          Enviar Mensaje
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import axios from "axios";

//Formulario Reactivo
const form = reactive({
  nombre: "",
  email: "",
  mensaje: "",
});

//Estado de envío
const envioExitoso = ref(null);

//Funcion para enviar mensaje
async function enviarMensaje() {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/contactos",
      form,
      {
        withCredentials: true,
      }
    );

    if (response.data.ok) {
      alert("Mensaje enviado con éxito");
    } else {
      alert("No se pudo enviar el mensaje");
    }
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    envioExitoso.value = false;
  } finally {
    enviando.value = false;
    // Limpiar el formulario
    form.nombre = "";
    form.email = "";
    form.mensaje = "";
  }
}
</script>
<style></style>
