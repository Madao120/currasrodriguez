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
            <!--Qate boton es el de reservar, chatgpteada-->
            <button
                class="btn badge btn-sm btn-warning ms-2"
                :disabled="vehiculo.estado !== 'disponible'"
                @click.stop="irAReserva(vehiculo)"
            >
                <i class="bi bi-bookmark-check me-1"></i> Reservar
            </button>
            <button
              v-if="vehiculo.estado === 'reservado' && isAdmin"
              class="btn badge btn-sm btn-danger ms-2"
              :disabled="vehiculo.estado !== 'reservado'"
              @click.stop="cancelarReserva(vehiculo)"
            >
              <i class="bi bi-x-circle me-1"></i> Cancelar reserva
            </button>

            <button
                type="button"
                @click="imprimirPDF(vehiculo)"
                class="btn btn-secondary ms-2 px-4 py-2 btn-sm rounded-0 border shadow-none"
            >
                <i class="bi bi-printer"></i>Imprimir
            </button>
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
import { getArticuloById, updateArticulo } from "@/api/articulos.js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logoPng.png";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();

const vehiculo = ref(null);
const cargando = ref(true);
const isAdmin = ref(false);

onMounted(async () => {
  try {
    isAdmin.value = sessionStorage.getItem("isAdmin") === "true";
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

//Reserva de vehiculo
const irAReserva = (vehiculo) => {
    if (vehiculo.estado !== "disponible") return;
    router.push({ name: "ReservaVehiculo", params: { id: vehiculo._id } });
};

// Cancelar Reserva si eres admin
const cancelarReserva = async (vehiculo) => {
  if (!isAdmin.value) return;
  if (vehiculo.estado !== "reservado") return;

  try {
    const actualizado = await updateArticulo(vehiculo._id, {
      estado: "disponible",
    });
    vehiculo.value = actualizado;
    Swal.fire("Reserva cancelada", "El vehiculo vuelve a estar disponible.", "success");
  } catch (error) {
    console.error("Error cancelando reserva:", error);
    Swal.fire("Error", "No se pudo cancelar la reserva.", "error");
  }
};


//Imprimir coche PDF
const imprimirPDF = (vehiculo) => {
  const doc = new jsPDF();

  doc.addImage(logo, "png", 10, 10, 20, 20);
    doc.setFontSize(18);
    doc.text("Ficha de Vehículo", 60, 20);

  const headers = [
    "Matrícula",
    "Marca",
    "Modelo",
    "Estado",
    "Combustible",
    "Precio",
  ];

    autoTable(doc, {
    startY: 30,
    head: [headers],
        body: [
            [
                vehiculo.matricula,
                vehiculo.marca,
                vehiculo.modelo,
                vehiculo.estado,
                vehiculo.combustible,
                vehiculo.precio,
            ],
        ],
    theme: "striped",
    styles: { fontSize: 10 },
  });

    doc.save(`vehiculo_${vehiculo.matricula || vehiculo._id}.pdf`);
};
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
