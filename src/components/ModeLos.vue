<template>
  <div class="container-fluid my-1 p-2 border rounded-0 shadow-sm bg-light">
    <!-- Mensaje si no es admin -->
    <div v-if="!isAdmin" class="alert alert-danger text-center mt-5">
      <i class="bi bi-exclamation-triangle me-2"></i>
      <strong>Acceso denegado:</strong> Solo los administradores pueden acceder
      a esta sección.
    </div>

    <!-- Contenido solo para admins -->
    <div v-else>
      <h5 class="text-center bg-primary-subtle py-1">
        <i class="bi bi-car-front me-2"></i>Registro de Vehículos
      </h5>

      <form @submit.prevent="guardarVehiculo" class="mb-2 mt-1">
        <!-- FILA: Tipo, Marca, Modelo -->
        <div class="row g-3 align-items-center mt-1">
          <div class="col-12 col-md-3 d-flex align-items-center">
            <label class="form-label mb-0 me-3 text-nowrap">Tipo:</label>
            <div class="d-flex align-items-center">
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  id="tipo-coche"
                  value="coche"
                  v-model="vehiculo.tipo"
                />
                <label class="form-check-label" for="tipo-coche">Coche</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  id="tipo-furgoneta"
                  value="furgoneta"
                  v-model="vehiculo.tipo"
                />
                <label class="form-check-label" for="tipo-furgoneta"
                  >Furgoneta</label
                >
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  id="tipo-moto"
                  value="moto"
                  v-model="vehiculo.tipo"
                />
                <label class="form-check-label" for="tipo-moto">Moto</label>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-2 d-flex align-items-center">
            <label for="matricula" class="form-label mb-0 me-3 text-nowrap"
              >Matricula:</label
            >
            <input
              type="text"
              id="matricula"
              v-model="vehiculo.matricula"
              class="form-control rounded-0 shadow-none border"
            />
          </div>

          <div class="col-12 col-md-2 d-flex align-items-center">
            <label for="marca" class="form-label mb-0 me-3 text-nowrap"
              >Marca:</label
            >
            <input
              type="text"
              id="marca"
              v-model="vehiculo.marca"
              class="form-control rounded-0 shadow-none border"
              required
            />
          </div>

          <div class="col-12 col-md-3 d-flex align-items-center">
            <label for="modelo" class="form-label mb-0 me-3 text-nowrap"
              >Modelo:</label
            >
            <input
              type="text"
              id="modelo"
              v-model="vehiculo.modelo"
              class="form-control rounded-0 shadow-none border"
              required
            />
          </div>

          <div class="col-12 col-md-2 d-flex align-items-center">
            <label for="anio" class="form-label mb-0 me-3 text-nowrap"
              >Año:</label
            >
            <select
              id="anio"
              v-model="vehiculo.anio"
              class="form-select rounded-0 shadow-none border"
              required
            >
              <!--copilot-->
              <option disabled value="">Seleccione</option>
              <option v-for="yr in years" :key="yr" :value="yr">
                {{ yr }}
              </option>
            </select>
          </div>
        </div>

        <!-- FILA: Kilómetros, Precio, Combustible, Transmisión -->
        <div class="row g-3 align-items-center mt-2">
          <div class="col-12 col-md-3 d-flex align-items-center">
            <label for="kilometros" class="form-label mb-0 me-3 text-nowrap"
              >Kilómetros:</label
            >
            <input
              type="number"
              id="kilometros"
              v-model="vehiculo.kilometros"
              class="form-control text-end rounded-0 shadow-none border"
              required
            />
          </div>

          <div class="col-12 col-md-2 d-flex align-items-center">
            <label for="precio" class="form-label mb-0 me-3 text-nowrap"
              >Precio (€):</label
            >
            <input
              type="number"
              id="precio"
              v-model="vehiculo.precio"
              class="form-control text-end rounded-0 shadow-none border"
              required
            />
          </div>

          <div class="col-12 col-md-2 d-flex align-items-center">
            <label for="combustible" class="form-label mb-0 me-3 text-nowrap"
              >Combustible:</label
            >
            <select
              id="combustible"
              v-model="vehiculo.combustible"
              class="form-select rounded-0 shadow-none border"
            >
              <option disabled value="">Seleccione</option>
              <option value="Gasolina">Gasolina</option>
              <option value="Diésel">Diésel</option>
              <option value="Híbrido">Híbrido</option>
              <option value="GLP">GLP</option>
              <option value="Eléctrico">Eléctrico</option>
            </select>
          </div>

          <div class="col-12 col-md-3 d-flex align-items-center">
            <label for="transmision" class="form-label mb-0 me-3 text-nowrap"
              >Transmisión:</label
            >
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="transmision-manual"
                value="manual"
                v-model="vehiculo.transmision"
              />
              <label class="form-check-label" for="transmision-manual"
                >Manual</label
              >
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="transmision-automatica"
                value="automatica"
                v-model="vehiculo.transmision"
              />
              <label class="form-check-label" for="transmision-automatica"
                >Automática</label
              >
            </div>
          </div>

          <div class="col-12 col-md-2 d-flex align-items-center">
            <label for="potencia" class="form-label mb-0 me-3 text-nowrap"
              >Potencia (CV):</label
            >
            <input
              type="text"
              id="potencia"
              v-model="vehiculo.potencia_cv"
              class="form-control rounded-0 shadow-none border"
            />
          </div>
          <!--Fila estado y nuevo-->
          <div class="row g-3 align-items-center mt-2">
            <div class="col-12 col-md-3 d-flex align-items-center">
              <label class="form-label mb-0 me-3 text-nowrap">Estado:</label>
              <select
                v-model="vehiculo.estado"
                class="form-select d-inline-block w-auto rounded-0 shadow-none border"
              >
                <option value="disponible">Disponible</option>
                <option value="vendido">Vendido</option>
                <option value="reservado">Reservado</option>
              </select>
            </div>

            <div class="col-12 col-md-2 d-flex align-items-center">
              <label for="nuevo" class="form-label mb-0 me-3 text-nowrap"
                >Nuevo:</label
              >
              <input
                type="text"
                id="nuevo"
                v-model="vehiculo.nuevo"
                class="form-control rounded-0 shadow-none border"
              />
            </div>
          </div>
        </div>

        <!-- FILA: Descripción -->
        <div class="row g-2 mt-3">
          <div class="col">
            <label for="descripcion" class="form-label">Descripción:</label>
            <textarea
              id="descripcion"
              v-model="vehiculo.descripcion"
              rows="3"
              class="form-control rounded-0 shadow-none border mb-2"
              placeholder="Describe el estado, revisiones, etc."
            ></textarea>
          </div>
        </div>
        <!-- FILA: Imagen del vehículo-->
        <div class="row g-3 align-items-center mb-3">
          <div class="col-12 col-md-3 d-flex align-items-center">
            <label for="foto" class="form-label mb-0 me-2 text-nowrap"
              >Imagen del Vehículo:</label
            >
            <input
              type="file"
              id="foto"
              accept="image/*"
              @change="onFileChange"
              class="form-control-file col-md-10 border rounded-0 shadow-none btn-file-azul"
            />
          </div>
        </div>

        <!-- BLOQUE: Ubicación -->
        <h6 class="text-center bg-primary-subtle py-1">
          <i class="bi bi-car-front me-2"></i>Cliente Ubicación
        </h6>
        <div class="row g-3 align-items-center mt-3">
          <div class="col-12 col-md-4">
            <label for="provincia" class="form-label">Provincia:</label>
            <select
              id="provincia"
              v-model="vehiculo.ubicacion.provincia"
              class="form-select rounded-0 shadow-none border"
              @change="filtrarCiudades"
            >
              <option disabled value="">Seleccione provincia</option>
              <option
                v-for="prov in provincias"
                :key="prov.id"
                :value="prov.nm"
              >
                {{ prov.nm }}
              </option>
            </select>
          </div>

          <div class="col-12 col-md-4">
            <label for="ciudad" class="form-label">Ciudad:</label>
            <select
              id="ciudad"
              v-model="vehiculo.ubicacion.ciudad"
              class="form-select rounded-0 shadow-none border"
            >
              <option disabled value="">Seleccione ciudad</option>
              <option
                v-for="mun in municipiosFiltrados"
                :key="mun.id"
                :value="mun.nm"
              >
                {{ mun.nm }}
              </option>
            </select>
          </div>

          <div class="col-12 col-md-4">
            <label for="fecha_publicacion" class="form-label"
              >Fecha Publicación:</label
            >
            <input
              type="date"
              id="fecha_publicacion"
              v-model="vehiculo.fecha_publicacion"
              class="form-control rounded-0 shadow-none border"
            />
          </div>
        </div>

        <!-- FILA: Contacto -->
        <div class="row g-3 align-items-center mt-3">
          <div class="col-12 col-md-4">
            <label for="contacto_nombre" class="form-label"
              >Nombre Contacto:</label
            >
            <input
              type="text"
              id="contacto_nombre"
              v-model="vehiculo.contacto.nombre"
              class="form-control rounded-0 shadow-none border"
            />
          </div>
          <div class="col-12 col-md-4">
            <label for="contacto_telefono" class="form-label">Teléfono:</label>
            <input
              type="tel"
              id="contacto_telefono"
              v-model="vehiculo.contacto.telefono"
              class="form-control text-center rounded-0 shadow-none border"
            />
          </div>
          <div class="col-12 col-md-4">
            <label for="contacto_email" class="form-label">Email:</label>
            <input
              type="email"
              id="contacto_email"
              v-model="vehiculo.contacto.email"
              class="form-control rounded-0 shadow-none border"
            />
          </div>
        </div>

        <!-- FILA: Estado y botones -->
        <div class="row g-3 align-items-center mt-3">
          <div
            class="col-12 d-flex align-items-center justify-content-center m"
          >
            <div>
              <button
                type="submit"
                class="btn btn-primary rounded-0 border shadow-none px-4 py-2"
              >
                {{ editando ? "Modificar" : "Guardar" }}
              </button>
              <button
                type="submit"
                class="btn btn-secondary rounded-0 border shadow-none px-4 py-2 ms-2"
              >
                Eliminar
              </button>
              <button
                type="button"
                @click="imprimirPDF"
                class="btn btn-secondary ms-2 px-4 py-2 btn-sm rounded-0 border shadow-none"
              >
                <i class="bi bi-printer"></i>Imprimir Todo
              </button>
              <!--
              <button
                type="button"
                @click="imprimirPDFKm"
                class="btn btn-secondary ms-2 px-4 py-2 btn-sm rounded-0 border shadow-none"
              >
                <i class="bi bi-printer"></i>Imprimir por km
              </button>
              <button
                type="button"
                @click="imprimirPDFAlfabetico"
                class="btn btn-secondary ms-2 px-4 py-2 btn-sm rounded-0 border shadow-none"
              >
                <i class="bi bi-printer"></i>Imprimir Alfabéticamente
              </button>
              <button
                type="button"
                @click="imprimirPDFPorKm"
                class="btn btn-secondary ms-2 px-4 py-2 btn-sm rounded-0 border shadow-none"
              >
                <i class="bi bi-printer"></i>Imprimir por Km (menor a mayor)
              </button>
              -->
            </div>
          </div>
        </div>
      </form>
      <div v-if="isAdmin" class="row g-2 align-items-center mt-2 mb-2">
        <div class="col-12 col-md-6">
          <input
            type="text"
            v-model="filtroModelo"
            placeholder="Buscar por modelo"
            class="form-control rounded-0 shadow-none border"
          />
        </div>
        <div class="col-12 col-md-6">
          <button
            type="button"
            @click="imprimirPDFPorModelo"
            class="btn btn-secondary px-4 py-2 btn-sm rounded-0 border shadow-none"
            :disabled="!filtroModelo.trim()"
          >
            <i class="bi bi-printer"></i>Imprimir filtrados
          </button>
        </div>
      </div>
      <table
        v-if="isAdmin"
        class="table table-bordered table-striped table-sm table-hover align-middle"
      >
        <thead>
          <tr class="table-primary text-center">
            <th>Matricula</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Modelo</th>
            <th>Precio</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="modelo in vehiculosFiltrados"
            :key="modelo._id"
            class="text-center"
          >
            <td>{{ modelo.matricula }}</td>
            <td>{{ modelo.marca }}</td>
            <td>{{ modelo.modelo }}</td>
            <td v-if="modelo.estado == 'reservado'" class="table-warning">
              {{ modelo.estado }}
            </td>
            <td v-else>{{ modelo.estado }}</td>
            <td>
              <div>
                {{ modelo.contacto.nombre }} {{ modelo.contacto.telefono }}
              </div>
            </td>
            <td>
              <button
                class="btn btn-sm btn-primary me-2"
                @click="
                  editando = true;
                  vehiculo = { ...modelo };
                "
              >
                <i class="bi bi-pencil"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { ref, computed, watch, onMounted } from "vue";
import { addArticulo, getArticulos } from "@/api/articulos.js";
import provmuniData from "../../backend/data/provmuni.json";
import logo from "../assets/logoPng.png";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Check if user is admin
const isAdmin = ref(sessionStorage.getItem("isAdmin") === "true");

const vehiculos = ref([]);
const vehiculo = ref({
  tipo: "",
  marca: "",
  modelo: "",
  anio: "",
  kilometros: "",
  precio: "",
  matricula: "",
  combustible: "",
  transmision: "",
  puertas: "",
  potencia_cv: "",
  descripcion: "",
  ubicacion: {
    provincia: "",
    ciudad: "",
  },
  contacto: {
    nombre: "",
    telefono: "",
    email: "",
  },
  fecha_publicacion: "",
  estado: "disponible",
  nuevo: "",
});

//Matrñicula en Mayúsculas
watch(
  () => vehiculo.value.matricula,
  (valor) => {
    if (valor) {
      vehiculo.value.matricula = valor.toUpperCase();
    }
  },
);

//Nombre en Primera letra mayúscula Tanto nombre como apellido
watch(
  () => vehiculo.value.contacto.nombre,
  (valor) => {
    if (!valor) return;
    vehiculo.value.contacto.nombre = valor
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  },
);

const editando = ref(false);
const archivo = ref(null);

const onFileChange = (e) => {
  archivo.value = e.target.files[0];
};

const provincias = ref([
  { id: 1, nm: "A Coruña" },
  { id: 2, nm: "Lugo" },
  { id: 3, nm: "Ourense" },
  { id: 4, nm: "Pontevedra" },
]);

const municipios = ref([
  { id: 1, nm: "Santiago de Compostela", prov: "A Coruña" },
  { id: 2, nm: "Ferrol", prov: "A Coruña" },
  { id: 3, nm: "Lugo", prov: "Lugo" },
  { id: 4, nm: "Monforte de Lemos", prov: "Lugo" },
  { id: 5, nm: "Ourense", prov: "Ourense" },
  { id: 6, nm: "Vigo", prov: "Pontevedra" },
  { id: 7, nm: "Pontevedra", prov: "Pontevedra" },
]);

const municipiosFiltrados = computed(() =>
  municipios.value.filter((m) => m.prov === vehiculo.value.ubicacion.provincia),
);

const filtroModelo = ref("");

const vehiculosFiltrados = computed(() => {
  const query = filtroModelo.value.trim().toLowerCase();
  if (!query) return vehiculos.value;

  return vehiculos.value.filter((vehiculo) => {
    const modelo = String(vehiculo.modelo || "").toLowerCase();
    return modelo.includes(query);
  });
});

// Años para el select: desde el año actual hasta 55 años atrás COPILOT
const currentYear = new Date().getFullYear();
const years = ref(Array.from({ length: 56 }, (_, i) => currentYear - i));

// Lista de artículos (vehículos) desde el backend
const articulos = ref([]);

onMounted(async () => {
  vehiculos.value = await getArticulos();
});

// const tiposVehiculo = ref(["coche", "moto", "furgoneta", "camión"]);
// const tiposCombustible = ref(["gasolina", "diésel", "híbrido", "eléctrico"]);

// Enviar datos al backend
const guardarVehiculo = async () => {
  try {
    const formData = new FormData();

    // Solo añadir imagen si hay archivo seleccionado
    if (archivo.value) {
      formData.append("imagen", archivo.value);
    }

    formData.append("vehiculo", JSON.stringify(vehiculo.value));

    const nuevo = await addArticulo(formData);
    // Si se ha creado, volver a recargar la lista
    if (nuevo && nuevo._id) {
      articulos.value = await getArticulos();
    }

    if (nuevo && nuevo._id) {
      Swal.fire({
        icon: "success",
        title: "Vehículo guardado",
        text: "El vehículo ha sido guardado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      console.error("Error al guardar el vehículo");
    }
    // limpiar formulario si quieres
    // Limpiar formulario (opcional)
    Object.assign(vehiculo.value, {
      tipo: "",
      matricula: "",
      marca: "",
      modelo: "",
      anio: "",
      estado: "disponible",
      nuevo: "",
      kilometros: "",
      precio: "",
      combustible: "",
      transmision: "",
      potencia_cv: "",
      descripcion: "",
      ubicacion: {
        provincia: "",
        ciudad: "",
      },
      contacto: {
        nombre: "",
        telefono: "",
        email: "",
      },
      fecha_publicacion: "",
    });
    archivo.value = null;
  } catch (error) {
    console.error("Error al guardar:", error);
  }
};

// Imprimir PDF
const imprimirPDF = () => {
  const doc = new jsPDF();

  doc.addImage(logo, "png", 10, 10, 20, 20);
  doc.setFontSize(18);
  doc.text("Listado de Vehículos", 60, 20);

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
    body: vehiculos.value.map((modelo) => [
      modelo.matricula,
      modelo.marca,
      modelo.modelo,
      modelo.estado,
      modelo.combustible,
      modelo.precio,
    ]),
    theme: "striped",
    styles: { fontSize: 10 },
  });

  doc.save("listado_vehiculos.pdf");
};
// Imprimir PDF solo con vehículos de menos de 10000 km
const imprimirPDFKm = () => {
  const doc = new jsPDF();

  doc.addImage(logo, "png", 10, 10, 20, 20);
  doc.setFontSize(18);
  doc.text("Listado de Vehículos (menos de 10000 km)", 60, 20);

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
    body: vehiculos.value
      .filter((modelo) => modelo.kilometros < 10000)
      .map((modelo) => [
        modelo.matricula,
        modelo.marca,
        modelo.modelo,
        modelo.estado,
        modelo.combustible,
        modelo.precio,
      ]),
    theme: "striped",
    styles: { fontSize: 10 },
  });

  doc.save("listado_vehiculos_menos_10000km.pdf");
};

// Imprimir PDF filtrando por modelo
const imprimirPDFPorModelo = () => {
  if (!filtroModelo.value.trim()) {
    Swal.fire("Error", "Por favor, escribe un modelo para filtrar.", "warning");
    return;
  }

  const doc = new jsPDF();

  doc.addImage(logo, "png", 10, 10, 20, 20);
  doc.setFontSize(18);
  doc.text(`Vehículos del modelo: ${filtroModelo.value}`, 60, 20);

  const headers = [
    "Matrícula",
    "Marca",
    "Modelo",
    "Estado",
    "Combustible",
    "Precio",
  ];

  const modeloFiltrado = vehiculosFiltrados.value;

  if (modeloFiltrado.length === 0) {
    Swal.fire(
      "Sin resultados",
      `No se encontraron vehículos del modelo "${filtroModelo.value}".`,
      "info",
    );
    return;
  }

  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: modeloFiltrado.map((modelo) => [
      modelo.matricula,
      modelo.marca,
      modelo.modelo,
      modelo.estado,
      modelo.combustible,
      modelo.precio,
    ]),
    theme: "striped",
    styles: { fontSize: 10 },
  });

  doc.save(`listado_vehiculos_${filtroModelo.value}.pdf`);
};

// Imprimir PDF ordenado alfabéticamente por modelo
const imprimirPDFAlfabetico = () => {
  const doc = new jsPDF();

  doc.addImage(logo, "png", 10, 10, 20, 20);
  doc.setFontSize(18);
  doc.text("Listado de Vehículos (Ordenado por Modelo)", 60, 20);

  const headers = [
    "Matrícula",
    "Marca",
    "Modelo",
    "Estado",
    "Combustible",
    "Precio",
  ];

  const vehiculosOrdenados = [...vehiculos.value].sort((a, b) =>
    a.modelo.localeCompare(b.modelo),
  );

  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: vehiculosOrdenados.map((modelo) => [
      modelo.matricula,
      modelo.marca,
      modelo.modelo,
      modelo.estado,
      modelo.combustible,
      modelo.precio,
    ]),
    theme: "striped",
    styles: { fontSize: 10 },
  });

  doc.save("listado_vehiculos_alfabetico.pdf");
};

// Imprimir PDF ordenado por kilómetros (menor a mayor)
const imprimirPDFPorKm = () => {
  const doc = new jsPDF();

  doc.addImage(logo, "png", 10, 10, 20, 20);
  doc.setFontSize(18);
  doc.text("Listado de Vehículos (Ordenado por Km)", 60, 20);

  const headers = ["Matrícula", "Marca", "Modelo", "Km", "Estado", "Precio"];

  const vehiculosOrdenados = [...vehiculos.value].sort(
    (a, b) => a.kilometros - b.kilometros,
  );

  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: vehiculosOrdenados.map((modelo) => [
      modelo.matricula,
      modelo.marca,
      modelo.modelo,
      modelo.kilometros,
      modelo.estado,
      modelo.precio,
    ]),
    theme: "striped",
    styles: { fontSize: 10 },
  });

  doc.save("listado_vehiculos_por_km.pdf");
};
</script>
<style></style>
