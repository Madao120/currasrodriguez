<template>
  <div
    class="container-fluid my-1 p-3 border rounded-3 shadow-sm min-vh-75 bg-light"
  >
    <h3
      class="text-center my-2 bg-`primary-subtle py-1 border bg-primary bg-opacity-25 text-primary p-3 rounded"
    >
      <i class="bi bi-person"></i>Formulario de Empleo
    </h3>

    <form>
      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre completo</label>
        <input
          type="text"
          class="form-control"
          id="nombre"
          v-model="formStore.datos.nombre"
          required
        />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Correo electrónico</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="formStore.datos.email"
          required
        />
      </div>

      <div class="mb-3">
        <label for="telefono" class="form-label">Número de teléfono</label>
        <input
          type="tel"
          class="form-control"
          id="telefono"
          v-model="formStore.datos.telefono"
          required
        />
      </div>

      <div class="mb-3">
        <label for="cv" class="form-label">Fotografía</label>
        <input
          type="file"
          class="form-control"
          id="cv"
          accept="image/*"
          required
          @change="onFileChange"
        />
      </div>

      <button
        type="submit"
        class="btn btn-primary"
        @click.prevent="enviarSolicitud"
      >
        Enviar solicitud
      </button>
    </form>
  </div>
</template>
<script setup>
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useFormEmpleoStore } from "@/store/formEmpleo";

const router = useRouter();
const formStore = useFormEmpleoStore();

const onFileChange = (e) => {
  formStore.datos.foto = e.target.files[0];
};

const enviarSolicitud = () => {
  if (!formStore.datos.foto) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, adjunta una fotografía",
    });
    return;
  }

  router.push({ name: "FormEmpleoEnvio" });

  Swal.fire({
    icon: "success",
    title: "Solicitud enviada",
    text: "Tu solicitud de empleo ha sido enviada con éxito.",
  });
};
</script>
<style scoped></style>
