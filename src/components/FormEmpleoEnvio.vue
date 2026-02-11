<template>
  <div
    class="container-fluid my-1 p-3 border rounded-3 shadow-sm min-vh-75 bg-light"
  >
    <h3
      class="text-center my-2 bg-`primary-subtle py-1 border bg-primary bg-opacity-25 text-primary p-3 rounded"
    >
      <i class="bi bi-person"></i>Formulario de Empleo
    </h3>
    <div class="alert alert-success">
      <h4 class="alert-heading">¡Solicitud enviada con éxito!</h4>
      <p>
        Gracias por tu interés en unirte a nuestro equipo. Hemos recibido tu
        solicitud y nos pondremos en contacto contigo lo antes posible.
      </p>
      <hr />
      <p class="mb-0">
        Mientras tanto, puedes seguir explorando nuestros vehículos disponibles
        o contactarnos si tienes alguna pregunta.
      </p>
    </div>
    <div v-if="formStore.datos.nombre" class="border p-3 mb-3 bg-white rounded">
      <p><strong>Nombre:</strong> {{ formStore.datos.nombre }}</p>
      <p><strong>Email:</strong> {{ formStore.datos.email }}</p>
      <p><strong>Teléfono:</strong> {{ formStore.datos.telefono }}</p>

      <img v-if="fotoUrl" :src="fotoUrl" class="img-fluid mt-3" />
    </div>
    <button
      type="button"
      @click="imprimirPDF()"
      class="btn btn-secondary ms-2 px-4 py-2 btn-sm rounded-0 border shadow-none"
    >
      <i class="bi bi-printer"></i>Imprimir
    </button>
    <button
      class="btn btn-outline-secondary"
      @click="
        formStore.$reset();
        $router.push('/');
      "
    >
      Volver al inicio
    </button>
  </div>
</template>
<script setup>
import { computed, onUnmounted } from "vue";
import { useFormEmpleoStore } from "@/store/formEmpleo";
import { jsPDF } from "jspdf";
import logo from "../assets/logoPng.png";

const formStore = useFormEmpleoStore();

let objectUrl = null;

const fotoUrl = computed(() => {
  if (!formStore.datos.foto) return null;

  objectUrl = URL.createObjectURL(formStore.datos.foto);
  return objectUrl;
});

// Limpieza de memoria (muy importante)
onUnmounted(() => {
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }
});

const cargarImagenBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // importante si es URL externa

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const base64 = canvas.toDataURL("image/png");
      resolve(base64);
    };

    img.onerror = reject;
    img.src = url;
  });
};

//Imprimir el pdf
const imprimirPDF = async () => {
  const doc = new jsPDF();

  doc.addImage(logo, "png", 10, 10, 20, 20);
  doc.setFontSize(18);
  doc.text("Ficha de Vehículo", 60, 20);

  doc.setFontSize(12);
  doc.text(formStore.datos.nombre, 60, 30);
  doc.setFontSize(12);
  doc.text(formStore.datos.email, 60, 40);
  doc.setFontSize(12);
  doc.text(formStore.datos.telefono, 60, 50);

  // Imagen del formulario
  if (fotoUrl.value) {
    const imagenBase64 = await cargarImagenBase64(fotoUrl.value);
    doc.addImage(imagenBase64, "PNG", 10, 70, 60, 60);
  }

  doc.save(
    `informe_${formStore.datos.nombre || formStore.datos.email}_CarTeis.pdf`,
  );
};
</script>
<style scoped></style>
