<template>
  <div class="container mt-4">
    <h5 class="text-center bg-warning-subtle py-2">
      <i class="bi bi-bookmark-check me-2"></i>Reserva de vehiculo
    </h5>

    <div v-if="cargando" class="alert alert-info">Cargando vehiculo...</div>

    <div v-else-if="!vehiculo" class="alert alert-danger">
      Vehiculo no encontrado.
    </div>

    <div v-else class="row g-3">
      <div class="col-12 col-md-5">
        <div class="card shadow-sm">
          <img
            :src="urlImagen(vehiculo.imagen)"
            class="card-img-top"
            alt="vehiculo"
            style="height: 220px; object-fit: cover"
          />
          <div class="card-body">
            <h5 class="card-title">
              {{ vehiculo.marca }} {{ vehiculo.modelo }}
            </h5>
            <p class="card-text">
              <strong>Ano:</strong> {{ vehiculo.anio }}<br />
              <strong>Km:</strong> {{ vehiculo.kilometros }}<br />
              <strong>Precio:</strong> {{ vehiculo.precio }}<br />
              <strong>Estado:</strong> {{ vehiculo.estado }}
            </p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-7">
        <form @submit.prevent="reservar" class="border p-3 shadow-sm bg-light">
          <div class="row g-2">
            <div class="col-12 col-md-6">
              <label class="form-label">Nombre</label>
              <input
                v-model.trim="form.nombre"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">Apellidos</label>
              <input
                v-model.trim="form.apellidos"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">Email</label>
              <input
                v-model.trim="form.email"
                type="email"
                class="form-control"
                required
              />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">Telefono</label>
              <input
                v-model.trim="form.telefono"
                type="tel"
                class="form-control"
                required
              />
            </div>
            <div class="col-12">
              <label class="form-label">DNI</label>
              <input
                v-model.trim="form.dni"
                type="text"
                class="form-control"
                required
              />
            </div>
          </div>
          <div class="mt-3 d-flex gap-2">
            <button
              class="btn btn-warning"
              type="submit"
              :disabled="vehiculo.estado !== 'disponible' || enviando"
            >
              <i class="bi bi-bookmark-check me-1"></i>
              {{
                vehiculo.estado === "disponible" ? "Reservar" : "No disponible"
              }}
            </button>
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="volver"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { getArticuloById, updateArticulo } from "@/api/articulos.js";

const route = useRoute();
const router = useRouter();

const vehiculo = ref(null);
const cargando = ref(true);
const enviando = ref(false);

const form = ref({
  nombre: "",
  apellidos: "",
  email: "",
  telefono: "",
  dni: "",
});

const urlImagen = (ruta) => {
  if (!ruta) return "/no-image.png";
  return `http://localhost:5000${ruta}`;
};

onMounted(async () => {
  try {
    const id = route.params.id;
    if (!id) return;
    vehiculo.value = await getArticuloById(id);
  } catch (error) {
    console.error("Error cargando vehiculo:", error);
  } finally {
    cargando.value = false;
  }
});

function validarFormulario() {
  const { nombre, apellidos, email, telefono, dni } = form.value;
  if (!nombre || !apellidos || !email || !telefono || !dni) {
    Swal.fire("Datos incompletos", "Completa todos los campos.", "warning");
    return false;
  }
  return true;
}

async function reservar() {
  if (!vehiculo.value) return;
  if (vehiculo.value.estado !== "disponible") {
    Swal.fire(
      "No disponible",
      "Este vehiculo ya no esta disponible.",
      "warning",
    );
    return;
  }
  if (!validarFormulario()) return;

  try {
    enviando.value = true;
    const actualizado = await updateArticulo(vehiculo.value._id, {
      estado: "reservado",
    });
    vehiculo.value = actualizado;
    Swal.fire("Reserva hecha", "Tu reserva se ha registrado.", "success");
    router.push({ name: "VenTas" });
  } catch (error) {
    console.error("Error reservando vehiculo:", error);
    Swal.fire("Error", "No se pudo completar la reserva.", "error");
  } finally {
    enviando.value = false;
  }
}

function volver() {
  router.push({ name: "VenTas" });
}
</script>

<style scoped>
.card-title {
  font-weight: bold;
}
</style>
