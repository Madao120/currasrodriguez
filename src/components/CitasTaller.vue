<template>
  <div class="container-fluid my-3 p-3 border rounded shadow-sm bg-light">
    <h3 class="text-center bg-primary bg-opacity-25 text-primary p-3 rounded">
      <i class="bi bi-wrench"></i>
      Registro de Citas
    </h3>

    <!-- Formulario -->
    <form @submit.prevent="guardar" class="mb-4">
      <!--Matrícula y Reset-->
      <div class="row g-3 align-items-center mt-1">
        <!-- Matrícula -->
        <div class="col-12 col-md-6 d-flex align-items-center">
          <label class="form-label mb-0 me-3 text-nowrap">Matrícula: </label>
          <input
            maxlength="10"
            type="text"
            v-model="nuevaCita.matricula"
            class="form-control w-auto"
            placeholder="Ej: 1234ABC"
            required
          />
        </div>
        <!-- Botón Reiniciar a la derecha en la misma fila -->
        <div class="col-12 col-md-6 d-flex align-items-center">
          <button
            type="button"
            class="btn btn-outline-danger btn-sm ms-auto"
            @click="resetForm"
          >
            <i class="bi bi-arrow-counterclockwise"></i> Reiniciar
          </button>
        </div>
      </div>

      <!--Mmovil + Fecha + Servicio-->
      <div class="row g-3 align-items-center mt-1">
        <!-- Movil -->
        <div class="col-12 col-md-3 d-flex align-items-center">
          <label class="form-label mb-0 me-3 text-nowrap">Móvil: </label>
          <input
            type="text"
            v-model="nuevaCita.movil"
            class="form-control"
            required
          />
        </div>
        <!-- Fecha -->
        <div
          class="col-12 col-md-3 d-flex align-items-center justify-content-end"
        >
          <label class="form-label mb-0 me-3 text-nowrap">Fecha Cita: </label>
          <input
            type="date"
            v-model="nuevaCita.fecha"
            class="form-control"
            required
          />
        </div>
        <!-- Servicio Taller -->
        <div class="col-12 col-md-3 d-flex align-items-center">
          <label class="form-label mb-0 me-3 text-nowrap">Servicio: </label>
          <select class="form-select" v-model="nuevaCita.servicio" required>
            <option disabled value="">Seleccione un servicio</option>
            <option
              v-for="servicio in servicios"
              :key="servicio"
              :value="servicio"
            >
              {{ servicio }}
            </option>
          </select>
        </div>

        <!-- Estado Cita -->
        <div
          class="col-12 col-md-3 d-flex align-items-center justify-content-center"
        >
          <label class="form-label mb-0 me-3 text-nowrap">Estado: </label>
          <div class="d-flex gap-3">
            <label class="form-label mb-0 me-3 text-nowrap"
              ><input
                type="radio"
                value="Finalizado"
                v-model="nuevaCita.estado"
              />
              Finalizado
            </label>
            <label class="form-label mb-0 me-3 text-nowrap"
              ><input
                type="radio"
                value="Pendiente"
                v-model="nuevaCita.estado"
                required
              />
              Pendiente</label
            >
          </div>
        </div>

        <!--Acepta-->
        <div class="row g-3 align-items-left mt-1 mb-4">
          <!-- Acepta -->
          <div class="col-12 col-md-2 d-flex align-items-center">
            <label class="form-label mb-0 me-3 text-nowrap" for="acepta"
              >Aceptar el Presupuesto:
            </label>
            <input
              class="form-check-input"
              type="checkbox"
              v-model="nuevaCita.acepta"
              id="acepta"
              required
            />
          </div>
        </div>
      </div>
      <div class="me-5">
        <button type="submit" class="btn btn-primary">
          {{ editando ? "Modificar" : "Guardar" }}
        </button>
        <button
          type="button"
          v-if="editando"
          class="btn btn-secondary ms-2"
          @click="resetForm"
        >
          Cancelar
        </button>
        <button
          class="btn btn-warning m-1"
          :disabled="!isAdmin"
          @click="verPendientes"
        >
          Ver Pendientes
        </button>
      </div>
    </form>

    <h4 class="text-center bg-primary bg-opacity-25 text-primary p-3 rounded">
      Listado de Citas
    </h4>

    <table class="table table-bordered table-striped table-hover">
      <thead class="table-primary">
        <tr>
          <th>ID</th>
          <th>Matricula</th>
          <th>Móvil Cliente</th>
          <th>Fecha Cita</th>
          <th>Servicio Taller</th>
          <th>Estado Cita</th>
          <th>Acepta el Presupuesto</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cita in citas" :key="cita.id">
          <td>{{ cita.id }}</td>
          <td>{{ cita.matricula }}</td>
          <td>{{ cita.movil }}</td>
          <td>{{ cita.fecha }}</td>
          <td>{{ cita.servicio }}</td>
          <td>{{ cita.estado }}</td>
          <td>{{ cita.acepta ? "Sí" : "No" }}</td>
          <td class="text-center">
            <button
              class="btn btn-warning btn-sm me-1"
              @click="cargarEdicion(cita)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn btn-danger btn-sm me-1"
              @click="eliminar(cita.id)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCita, guardarCita, deleteCita, updateCita } from "../api/citas";
import Swal from "sweetalert2";
import isAdmin from "./NavBar.vue";

//Lista donde guardaré las citas
const citas = ref([]);

// Boolean para saber si estoy editando
const editando = ref(false);

// Pendientes
const pendiente = ref(false);

async function verPendientes() {
  if (pendiente) {
    pendiente == false;
  } else {
    pendiente == true;
  }
}

// Formulario de Nueva Cita
const nuevaCita = ref({
  matricula: "",
  movil: "",
  fecha: "",
  servicio: "",
  estado: "Pendiente",
  acepta: false,
});

// Servicios de Taller en el Select
const servicios = [
  "revision",
  "preITV",
  "neumáticos",
  "frenos",
  "cambio de aceite",
];

// Guardar Cita
async function cargarCitas() {
  citas.value = await getCita();
}

async function guardar() {
  if (!(await validarMatricula())) {
    return;
  }

  let citaAguardar = { ...nuevaCita.value };

  if (!editando.value) {
    await guardarCita(citaAguardar);
    await Swal.fire({
      icon: "success",
      title: "Añadido",
      text: "Cita añadida correctamente",
      timer: 1500,
      showConfirmButton: false,
    });
  } else {
    await updateCita(citaAguardar.id, citaAguardar);
    await Swal.fire({
      icon: "success",
      title: "Modificado",
      text: "Cita modificada correctamente",
      timer: 1500,
      showConfirmButton: false,
    });
  }
  cargarCitas();
  resetForm();
}

// Editar por id
function cargarEdicion(cita) {
  nuevaCita.value = { ...cita };
  editando.value = true;
}

// Eliminar por id
async function eliminar(id) {
  await deleteCita(id);
  cargarCitas();
}

// Resetear formulario, para el botón reset y el botón cancelar que aparece al editar
function resetForm() {
  nuevaCita.value = {
    matricula: "",
    movil: "",
    fecha: "",
    servicio: "",
    estado: "Pendiente",
    acepta: false,
  };
  editando.value = false;
}

// Validar Matrícula
async function validarMatricula() {
  const valor = nuevaCita.value.matricula.toUpperCase().trim();
  nuevaCita.value.matricula = valor;

  // Comprobar si la matrícula está ya en el sistema
  const repetido = citas.value.find((c) => c.matricula === valor);
  if (!editando.value && repetido) {
    await Swal.fire({
      icon: "warning",
      title: "Matricula Existente",
      text: "Ya eres cliente debido a que su matrícula está repetida.",
    });
    return true;
  }

  return true;
}

// Cargar las Citas al entrar
onMounted(cargarCitas);
</script>
