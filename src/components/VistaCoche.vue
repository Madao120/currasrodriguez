<template>
  <div v-if="cargando" class="alert alert-info">Cargando vehiculo...</div>

  <div v-else-if="!vehiculo" class="alert alert-danger">
    Vehiculo no encontrado.
  </div>

  <div v-else>
    <h3
      class="text-center my-2 bg-`primary-subtle py-1 border bg-primary bg-opacity-25 text-primary p-3 rounded"
    >
      <i class="bi bi-person"></i>Vista de Coche
    </h3>
    <div class="d-flex justify-content-center">
      <div class="col-12 col-md-5">
        <div class="card shadow-sm">
          <img
            :src="urlImagen(vehiculo.imagen)"
            class="card-img-top"
            alt="vehiculo"
            style="height: 220px; object-fit: cover"
          />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">
              {{ vehiculo.marca }} {{ vehiculo.modelo }}
            </h5>
            <p class="card-text">
              <strong>Precio:</strong> {{ vehiculo.precio }} €
            </p>
            <p class="card-text">
              <strong>Matricula:</strong> {{ vehiculo.matricula }}
            </p>
            <p class="card-text">
              <strong>Kilometros:</strong> {{ vehiculo.kilometros }} km
            </p>
            <p class="card-text"><strong>Año:</strong> {{ vehiculo.anio }}</p>
            <p class="card-text"><strong>Tipo:</strong> {{ vehiculo.tipo }}</p>
            <p class="card-text">
              <strong>Combustible:</strong> {{ vehiculo.combustible }}
            </p>
            <p class="card-text">
              <strong>Estado:</strong> {{ vehiculo.estado }}
            </p>
            <p class="card-text">
              <strong>Descripción:</strong><br />
              {{ vehiculo.descripcion }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <button class="btn btn-outline-secondary" type="button" @click="volver">
      Cancelar
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getArticuloById } from "@/api/articulos.js";

const route = useRoute();
const router = useRouter();

const vehiculo = ref(null);
const cargando = ref(true);

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

const urlImagen = (ruta) => {
  if (!ruta) return "/no-image.png";
  return `http://localhost:5000${ruta}`;
};

function volver() {
  router.push({ name: "VenTas" });
}
</script>

<style scoped>
.card-title {
  font-weight: bold;
}
</style>

<!--<template>
  <div v-if="cargando" class="alert alert-info">Cargando vehiculo...</div>

  <div v-else-if="!vehiculo" class="alert alert-danger">
    Vehiculo no encontrado.
  </div>

  <div v-else>
    <h1>{{ vehiculo.modelo }}</h1>
    <div class="d-flex justify-content-center">
      <div class="card mb-3" style="max-width: 540px">
        <div class="row g-0">
          <div class="col-md-4">
            <img
              :src="urlImagen(vehiculo.imagen)"
              class="img-fluid rounded-start"
              alt="..."
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">
                {{ vehiculo.marca }} {{ vehiculo.modelo }}
              </h5>
              <p class="card-text"><strong>Año:</strong> {{ vehiculo.anio }}</p>
              <p class="card-text">
                <strong>Kilometros:</strong> {{ vehiculo.kilometros }}
              </p>
              <p class="card-text">
                <strong>Precio:</strong> {{ vehiculo.precio }}
              </p>
              <p class="card-text">
                <strong>Estado:</strong> {{ vehiculo.estado }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="btn btn-outline-secondary" type="button" @click="volver">
      Cancelar
    </button>
  </div>
</template>
<script>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getArticuloById } from "@/api/articulos.js";

const route = useRoute();
const router = useRouter();
const cargando = ref(true);
const vehiculo = ref(null);

onMounted(async () => {
  try {
    const id = route.params.id;
    if (!id) return;
    vehiculo.value = await getArticuloById(id);
    console.log("primer try");
  } catch (error) {
    console.error("Error cargando vehiculo:", error);
    console.log("llegue al catch");
  } finally {
    cargando.value = false;
  }
});

const urlImagen = (ruta) => {
  if (!ruta) return "/no-image.png";
  return `http://localhost:5000${ruta}`;
};

function volver() {
  router.push({ name: "VenTas" });
}
</script>
-->
