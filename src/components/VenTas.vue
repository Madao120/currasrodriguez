<template>
    <div class="container-fluid mt-4 mb-4">
        <div class="row g-4">
            <div 
            v-for="car in vehiculos"
            :key="car._id"
            class="col-12 col-md-6 col-lg-3"
            >
                <div class="card h-80 shadow-sm">
                    <img
                        :src="urlImagen(car.imagen)"
                        class="card-img-top"
                        alt="vehiculo"
                        style="height: 200px; object-fit: cover;"
                    ></img>

                    <div class="card-body">
                        <h5 class="card-title">{{ car.marca }} {{ car.modelo }}</h5>
                        <p class="card-text">
                            <strong>Año:</strong>{{ car.anio }}<br>
                            <strong>Km:</strong>{{ car.kilometros }}<br>
                            <strong>Precio:</strong>{{ car.precio }}<br>
                        </p>   
                    </div>

                    <div class="card-footer text-end bg-white">
                        <span class="badge bg-primary">{{ car.estado }}</span>
                        <button 
                            class="btn badge btn-sm btn-success ms-2"
                            :class="car.estado === 'disponible' ? 'btn-success' : 'btn-danger'"
                            :disabled="car.estado !== 'disponible'"
                            @click.stop="agregarACesta(car)">
                            <i class="bi bi-cart3 me-1"></i>
                            {{ car.estado === 'disponible' ? 'Añadir Cesta' : 'No disponible' }}
                            
                            </button>
                        <!--BOTON DE RESERVAR-->
                        <button
                            class="btn badge btn-sm btn-warning ms-2"
                            :disabled="car.estado !== 'disponible'"
                            @click.stop="irAReserva(car)"
                        >
                            <i class="bi bi-bookmark-check me-1"></i> Reservar
                        </button>
                        <button
                            class="btn badge btn-sm btn-warning ms-2"
                            :disabled="car.estado !== 'disponible'"
                            @click.stop="reservarDirecto(car)"
                        >
                            <i class="bi bi-bookmark-check me-1"></i> Reservar Directo
                        </button>

                        <!--Boton de vista-->
                        <button
                            class="btn badge btn-sm bg-primary ms-2"
                            @click.stop="irAVista(car)"
                        >
                            <i class="bi bi-bookmark-check me-1"></i> Ver detalles del Vehículo
                        </button>
                        
                        <!--Cancelar Reserva-->
                        <button v-if="car.estado === 'reservado' && isAdmin"
                        class="btn badge btn-sm btn-danger ms-2"
                        :disabled="car.estado !== 'reservado'"
                        @click.stop="cancelarReserva(car)"
                        >
                        <i class="bi bi-x-circle me-1"></i> Cancelar reserva
                        </button>

                        <!--Imprimir un solo coche-->
                        <button
                            type="button"
                            @click="imprimirPDF(car)"
                            class="btn btn-secondary ms-2 px-4 py-2 btn-sm rounded-0 border shadow-none"
                        >
                            <i class="bi bi-printer"></i>Imprimir
                        </button>
                    </div>
                </div>
            </div>
            <div class="">
                <button
                    class="btn btn-outline-secondary mt-4"
                    @click="router.push({ name: 'CochesOrdenados' })">
                Ordenar Coches por Modelo</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getArticulos, updateArticulo } from "@/api/articulos.js";
import { useCestaStore } from "@/store/cesta.js";
import logo from "../assets/logoPng.png";
import Swal from "sweetalert2";
// Importamos router para
import { useRouter } from "vue-router";
const router = useRouter();
const cestaStore = useCestaStore();

const vehiculos = ref([]);
const isAdmin = ref(false);

onMounted(async () => {
    isAdmin.value = sessionStorage.getItem("isAdmin") === "true";
    vehiculos.value = await getArticulos();
    for (const element of vehiculos.value) {
        console.log(element.imagen);
    }
});

const urlImagen = (ruta) => {
    if (!ruta) return "/no-image.png";
    return `http://localhost:5000${ruta}`
};

//Añadir vehículo a la cesta de la compra el id, marca, modelo, precio e imagen

const agregarACesta = (vehiculo) => {
    if (vehiculo.estado !== "disponible") return; //si no esta disponible no se hara la compra
    cestaStore.addProducto({
        id: vehiculo._id,
        nombre: `${vehiculo.marca} ${vehiculo.modelo}`,
        precio: vehiculo.precio,
        imagen: urlImagen(vehiculo.imagen),
    });
};

//Reserva de vehiculo
const irAReserva = (vehiculo) => {
    if (vehiculo.estado !== "disponible") return;
    router.push({ name: "ReservaVehiculo", params: { id: vehiculo._id } });
};

// Función comentada para reservar el vehículo directamente sin ir a otra página
// Si quieres usar esta función, descomenta y cambia @click="irAReserva(car)" por @click="reservarDirecto(car)"

const reservarDirecto = async (vehiculo) => {
  if (vehiculo.estado !== "disponible") return;

  try {
    const actualizado = await updateArticulo(vehiculo._id, {
      estado: "reservado",
    });
    const index = vehiculos.value.findIndex((item) => item._id === vehiculo._id);
    if (index !== -1) {
      vehiculos.value[index] = actualizado;
    }
    Swal.fire("Reserva realizada", "El vehículo ha sido reservado correctamente.", "success");
  } catch (error) {
    console.error("Error reservando vehículo:", error);
    Swal.fire("Error", "No se pudo reservar el vehículo.", "error");
  }
};


// Cancelar Reserva si eres admin
const cancelarReserva = async (vehiculo) => {
  if (!isAdmin.value) return;
  if (vehiculo.estado !== "reservado") return;

  try {
    const actualizado = await updateArticulo(vehiculo._id, {
      estado: "disponible",
    });
        const index = vehiculos.value.findIndex((item) => item._id === vehiculo._id);
        if (index !== -1) {
            vehiculos.value[index] = actualizado;
        }
    Swal.fire("Reserva cancelada", "El vehiculo vuelve a estar disponible.", "success");
  } catch (error) {
    console.error("Error cancelando reserva:", error);
    Swal.fire("Error", "No se pudo cancelar la reserva.", "error");
  }
};

//Vista de Coche
const irAVista = (vehiculo) => {
    router.push({ name: "VistaCoche", params: { id: vehiculo._id } })
}

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
.card-title{
    font-weight: bold;
    text-transform: capitalize;
}
</style>