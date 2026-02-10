<template>
  <div class="container mt-4 mb-4">
    <h2 class="mb-3">Coches ordenados por modelo</h2>
    <div class="row g-4">
      <div v-for="car in cochesOrdenados" :key="car._id" class="col-12 col-md-6 col-lg-3">
        <div class="card h-80 shadow-sm">
          <img
            :src="urlImagen(car.imagen)"
            class="card-img-top"
            alt="vehiculo"
            style="height: 200px; object-fit: cover;"
          />
          <div class="card-body">
            <h5 class="card-title">{{ car.marca }} {{ car.modelo }}</h5>
            <p class="card-text">
              <strong>Anio:</strong> {{ car.anio }}<br />
              <strong>Km:</strong> {{ car.kilometros }}<br />
              <strong>Precio:</strong> {{ car.precio }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getArticulos } from "@/api/articulos.js";

const vehiculos = ref([]);

onMounted(async () => {
  vehiculos.value = await getArticulos();
});

const cochesOrdenados = computed(() => {
  return [...vehiculos.value].sort((a, b) => {
    const modeloA = (a.modelo || "").toLowerCase();
    const modeloB = (b.modelo || "").toLowerCase();
    return modeloA.localeCompare(modeloB, "es", { sensitivity: "base" });
  });
});

/*  ORDENAR POR MATRICULA
const cochesOrdenados = computed(() => {
  return [...vehiculos.value].sort((a, b) => {
    const matA = (a.matricula || "").toLowerCase();
    const matB = (b.matricula || "").toLowerCase();
    return matA.localeCompare(matB, "es", { sensitivity: "base" });
  });
});
*/

/*  ORDENAR POR AÑO
const cochesOrdenados = computed(() => {
  return [...vehiculos.value].sort((a, b) => {
    const anioA = Number(a.anio) || 0;
    const anioB = Number(b.anio) || 0;
    return anioA - anioB; // ascendente
  });
});
*/

const urlImagen = (ruta) => {
  if (!ruta) return "/no-image.png";
  return `http://localhost:5000${ruta}`;
};
</script>

<style scoped>
.card-title {
  font-weight: bold;
  text-transform: capitalize;
}
</style>
