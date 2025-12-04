<template>
  <div
    class="container-fluid my-1 p-3 border rounded-3 shadow-sm min-vh-75 bg-light"
  >
    <h3
      class="text-center my-2 bg-`primary-subtle py-1 border bg-primary bg-opacity-25 text-primary p-3 rounded"
    >
      <i class="bi bi-person"></i>Registro de Clientes
    </h3>
    <!-- Formulario -->
    <form @submit.prevent="guardarCliente" class="mb-4">
      <!-- DNI con validación visual -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Columna DNI -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="dni" class="form-label mb-0 text-nowrap me-2 w-25"
            >DNI:
          </label>
          <div class="flex-grow-1 d-flex align-items-center">
            <input
              type="text"
              id="dni"
              v-model="nuevoCliente.dni"
              @blur="validarDni"
              class="form-control text-center"
              :class="{ 'is-invalid': !dniValido }"
              :disabled="editando"
              required
              oninvalid="this.setCustomValidity('Por favor, rellene este campo')"
              oninput="this.setCustomValidity('')"
              style="max-width: 160px"
            />
            <button
              type="button"
              class="btn btn-primary ms-2 border-0 shadow-none rounded-0"
              @click="buscarClientePorDNI(nuevoCliente.dni)"
            >
              <i class="bi bi-search"></i>
            </button>

            <div v-if="!dniValido" class="invalid-feedback">
              DNI o NIE inválido.
            </div>
          </div>
        </div>

        <!-- Tipo Cliente y Columna Fecha de Alta -->
        <div class="col-md-6 d-flex align-items-center">
          <div class="col-md-8 d-flex align-items-center">
            <label>Tipo de Cliente:</label>
            <div class="ms-3">
              <label for="radio-empresa">Empresa:</label>
              <input
                type="radio"
                id="radio-empresa"
                name="radio"
                class="ms-2"
                value="empresa"
                v-model="nuevoCliente.tipo_cliente"
                required
              />
            </div>

            <div class="ms-3">
              <label for="radio-particular">Particular:</label>
              <input
                type="radio"
                id="radio-particular"
                name="radio"
                class="ms-2"
                value="particular"
                v-model="nuevoCliente.tipo_cliente"
                required
              />
            </div>
          </div>

          <div class="col-md-3 d-flex align-items-center">
            <label for="fecha_alta" class="form-label me-4 mb-0 text-nowrap"
              >Fecha de Alta:</label
            >
            <input
              type="date"
              id="fecha_alta"
              v-model="nuevoCliente.fecha_alta"
              class="form-control"
              required
              oninvalid="this.setCustomValidity('Por favor, rellene este campo')"
              oninput="this.setCustomValidity('')"
              style="max-width: 180px"
            />
          </div>
        </div>
        <!-- Botón reset en columna separada -->
        <div class="col d-flex justify-content-end">
          <button
            type="button"
            class="btn border border-primary border-2 rounded-0 text-primary shadow-none"
            style="--bs-btn-hover-bg: var(--bs-primary-bg-subtle)"
            @click="resetForm"
            title="Limpiar formulario"
          >
            <i class="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </div>

      <!-- Nombre y Apellidos -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Nombre -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="nombre" class="form-label mb-0 text-nowrap me-2 w-25"
            >Nombre:</label
          >
          <input
            type="text"
            id="nombre"
            v-model="nuevoCliente.nombre"
            class="form-control flex-grow-1"
            @blur="capitalizarTexto('nombre')"
            required
          />
        </div>

        <!-- Apellidos -->
        <div class="col-md-4 d-flex align-items-center ms-5">
          <label for="apellidos" class="form-label me-4 mb-0 text-nowrap"
            >Apellidos:</label
          >
          <input
            type="text"
            id="apellidos"
            v-model="nuevoCliente.apellidos"
            class="form-control flex-grow-1"
            @blur="capitalizarTexto('apellidos')"
            required
          />
        </div>
      </div>

      <!-- Email y Móvil -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Email -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="email" class="form-label mb-0 text-nowrap w-25"
            >Email:</label
          >
          <input
            type="email"
            id="email"
            v-model="nuevoCliente.email"
            class="form-control flex-grow-1"
            @blur="validarEmail"
            :class="{ 'is-invalid': !emailValido }"
            required
          />
        </div>

        <!-- Móvil -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="movil" class="form-label me-4 ms-5 mb-0 text-nowrap"
            >Móvil:</label
          >
          <input
            type="tel"
            id="movil"
            v-model="nuevoCliente.movil"
            @blur="validarMovil"
            class="form-control flex-grow-1 text-center"
            :class="{ 'is-invalid': !movilValido }"
            required
          />
        </div>
      </div>

      <!-- Dirección, Provincia y Municipio -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Dirección -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="direccion" class="form-label mb-0 w-25 text-nowrap"
            >Dirección:</label
          >
          <input
            type="text"
            id="direccion"
            v-model="nuevoCliente.direccion"
            class="form-control flex-grow-1"
            required
          />
        </div>

        <!-- Provincia -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="provincia" class="form-label me-2 ms-5 mb-0 text-nowrap"
            >Provincia:</label
          >
          <select
            id="provincia"
            v-model="nuevoCliente.provincia"
            class="form-select flex-grow-1 w-25"
            @change="filtrarMunicipios"
          >
            <option disabled value="">Seleccione provincia</option>
            <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">
              {{ prov.nm }}
            </option>
          </select>
        </div>

        <!-- Municipio -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="municipio" class="form-label me-2 ms-4 mb-0 text-nowrap"
            >Municipio:</label
          >
          <select
            id="municipio"
            v-model="nuevoCliente.municipio"
            class="form-select flex-grow-1 w-auto"
          >
            <option disabled value="">Seleccione municipio</option>
            <option
              v-for="mun in municipiosFiltrados"
              :key="mun.id"
              :value="mun.nm"
            >
              {{ mun.nm }}
            </option>
          </select>
        </div>
      </div>
      <!--Registro y Checkbox de Aceptar términos y condiciones (centrado y accesible)-->
      <!--Registrar con Contraseña-->
      <div class="row mb-3">
        <div
          class="row g-2 align-items-center mt-2 justify-content-center d-flex"
        >
          <div class="col-md-3 d-flex align-items-center mt-3">
            <label for="pass" class="form-label mb-0 text-nowrap-middle me-2"
              >Contraseña:</label
            >
            <input
              type="password"
              id="pass"
              v-model="nuevoCliente.password"
              class="form-control"
              required
            />
          </div>
          <!--Repetir contraseña -->
          <div class="col-md-3 mt-3 d-flex align-items-center ms-5">
            <label
              for="pass2"
              class="form-label mb-0 text-nowrap align-middle me-2"
              >Repetir Contraseña:</label
            >
            <input
              type="password"
              id="pass2"
              v-model="nuevoCliente.password2"
              class="form-control flex-grow-1"
              required
            />
          </div>
        </div>
        <div class="d-flex align-tiems-center justify-content-center mt-2">
          <input
            class="form-check-input me-1"
            type="checkbox"
            id="acepta"
            v-model="nuevoCliente.lopd"
            required
          />
          <label class="form-check-label ms-2" for="acepta">
            Aceptar términos y condiciones
            <span class="ms-2"
              ><router-link to="/aviso-legal"
                >Ver Condiciones</router-link
              ></span
            >
          </label>
        </div>
      </div>

      <!-- Botón MODIFICAR CLIENTE e HISTORICO centrado y checkbox al final -->
      <div class="position-relative d-flex align-items-center mt-3">
        <!-- Botón centrado absolutamente dentro del contenedor -->
        <div class="center-button">
          <button
            type="submit"
            class="btn btn-primary px-4"
            :disabled="!nuevoCliente.lopd"
          >
            {{ editando ? "Modificar" : "Guardar" }}
          </button>
        </div>

        <!-- Checkbox al final (alineado a la derecha) -->
        <div class="form-check form-switch ms-auto">
          <input
            type="checkbox"
            id="historico"
            v-model="mostrarHistorico"
            class="form-check-input"
            @change="cargarClientes"
          />
          <label for="historico" class="form-check-label ms-2">Histórico</label>
        </div>
      </div>
    </form>

    <!-- Lista de Clientes     <div v-if="admin" class="table-responsive">-->
    <div v-if="admin" class="table-responsive">
      <h4
        class="text-center w-100 text-center my-2 bg-`primary-subtle py-1 border bg-primary bg-opacity-25 text-primary p-3 rounded"
      >
        Listado Clientes
      </h4>
      <table
        class="table table-bordered table-striped table-hover table-sm align-middle"
      >
        <thead class="table-primary">
          <tr>
            <th class="text-center" scope="col">ID</th>
            <th scope="col">Apellidos</th>
            <th scope="col">Nombre</th>
            <th class="text-center" scope="col">Móvil</th>
            <th class="text-center" scope="col">Municipio</th>
            <th class="text-center" scope="col" style="width: 150px">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(cliente, index) in clientesPaginados"
            :key="cliente.id || index"
          >
            <th scope="row" class="text-center">
              {{ (currentPage - 1) * clientesPorPage + index + 1 }}
            </th>
            <td>{{ cliente.apellidos }}</td>
            <td>{{ cliente.nombre }}</td>
            <td class="text-center">{{ cliente.movil }}</td>
            <td class="text-center">{{ cliente.municipio }}</td>
            <td class="text-start">
              <button
                @click="eliminarCliente(cliente.movil)"
                class="btn btn-danger btn-sm border-0 ms-4 me-2 shadow-none rounded-0"
              >
                <i class="bi bi-trash"></i>
              </button>
              <button
                @click="editarCliente(cliente.movil)"
                class="btn btn-warning btn-sm shadow-none rounded-0"
                title="Editar cliente"
                aria-label="Editar cliente"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                v-if="cliente.historico === false"
                @click="activarCliente(cliente)"
                class="btn btn-secondary btn-sm ms-2 border-0 shadow-none rounded-0"
                title="Activar cliente"
              >
                <i class="bi bi-person-check"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Navegación de página-->
      <div class="d-flex justify-content-center my-3">
        <button
          class="btn btn-outline-primary btn-sm me-2 rounded-0 border-1 shadow-none"
          @click="beforePagina"
          :disabled="currentPage <= 1"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="mx-3 align-self-center text-muted"
          >Página {{ currentPage }}</span
        >
        <button
          class="btn btn-outline-primary btn-sm rounded-0 border-1 shadow-none"
          @click="nextPagina"
          :disabled="currentPage >= totalPages"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import provmuniData from "@/data/provmuni.json";
import { ref, onMounted, computed } from "vue";
import {
  getClientes,
  addCliente,
  deleteCliente,
  updateCliente,
  getClientePorDni,
} from "@/api/clientes.js";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";
//import jwt from "jsonwebtoken";

//////////////////// SCRIPTS CRUD ///////////////////////

const nuevoCliente = ref({
  dni: "",
  nombre: "",
  apellidos: "",
  email: "",
  movil: "",
  direccion: "",
  provincia: "",
  municipio: "",
  fecha_alta: "",
  tipo_cliente: "",
  historico: true,
  lopd: false,
  tipo: "user",
  password: "",
});

//////////// Declaraciones de estado o variables reactivas

const editando = ref(false); // Estado de edición para el formulario para usar el mismo boton
const clienteEditandoId = ref(null); //

const mostrarHistorico = ref(false); //Estado del checkbox

//Función listar clientes con get
const clientes = ref([]);

const numclientes = ref(0); // Número total de clientes
const currentPage = ref(1); // Página actual
const clientesPorPage = 10; // Número de clientes por página

const cargando = ref(false); // Control de carga de datos

const admin = localStorage.getItem("isAdmin") === "true";
const usuario = localStorage.getItem("isUsuario") === "true";
/////////// zona CargarClientes

// Zona Cargar clientes Al Montar el componente
onMounted(async () => {
  cargarClientes();
  currentPage.value = 1; // Iniciar en la primera página
});

const beforePagina = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPagina = () => {
  const totalPages = Math.ceil(numclientes.value / clientesPorPage); //redondear hacia arriba para mostrar la última página aunque no esté completa
  if (currentPage.value < totalPages) {
    currentPage.value++;
  }
};

// Propiedad computada para obtener los clientes de la página actual
// computed crea una propiedad que se actualiza automáticamente
//cuando cambian las dependencias (CurrentPage o clientes)
// es decir paso pagina o vuelvo atrás cargando los clientes de esa página
//slice extrae una sección del array clientes
//start es el índice inicial y end el índice final (no incluido)
const clientesPaginados = computed(() => {
  const start = (currentPage.value - 1) * clientesPorPage;
  const end = start + clientesPorPage;
  return clientes.value.slice(start, end);
});

const cargarClientes = () => {
  getClientes(mostrarHistorico.value).then((data) => {
    clientes.value = data;
    numclientes.value = data.length; //Actualiza el numero total de clientes
    currentPage.value = 1; // Reiniciar a la primera págiona al cargar
  });
  Swal.fire({
    icon: "success",
    title: "Listando Clientes...",
    showConfirmButton: false,
    timer: 1500,
  });
};

/////// GUARDAR CLIENTE COMPLETO
const guardarCliente = async () => {
  // Validación de contraseñas: si no coinciden, mostrar error y cancelar
  if (nuevoCliente.value.password !== nuevoCliente.value.password2) {
    Swal.fire({
      icon: "error",
      title: "La contraseña no es la misma",
      showConfirmButton: false,
      timer: 2000,
    });
    return;
  }
  if (nuevoCliente.value.fecha_alta.includes("/")) {
    nuevoCliente.value.fecha_alta = formatearFechaParaInput(
      nuevoCliente.value.fecha_alta
    );
  }

  // Hash de la contraseña antes de guardar
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(nuevoCliente.value.password, salt);

  // Validar duplicados solo si estás creando (no si editando)
  if (!editando.value) {
    const duplicado = clientes.value.find(
      (cliente) =>
        cliente.dni === nuevoCliente.value.dni ||
        cliente.movil === nuevoCliente.value.movil ||
        cliente.email === nuevoCliente.value.email
    );
    if (duplicado) {
      Swal.fire({
        icon: "error",
        title: "DNI, móvil o email duplicados",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
  }

  nuevoCliente.value.password = hash;
  delete nuevoCliente.value.password2; // Eliminar password2 antes de guardar

  // Confirmación antes de guardar
  const result = await Swal.fire({
    title: editando.value
      ? "¿Desea modificar este cliente?"
      : "¿Desea grabar este cliente?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: editando.value ? "Modificar" : "Grabar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  try {
    if (editando.value) {
      // Modificar cliente (PUT)
      const clienteActualizado = await updateCliente(
        clienteEditandoId.value,
        nuevoCliente.value
      );
      // Actualiza el cliente en la lista local
      const index = clientes.value.findIndex(
        (c) => c.id === clienteEditandoId.value
      );
      if (index !== -1) clientes.value[index] = clienteActualizado;
      Swal.fire({
        icon: "success",
        title: "Cliente modificado",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      // Agregar cliente (POST)
      const clienteAgregado = await addCliente(nuevoCliente.value);
      clientes.value.push(clienteAgregado);
      Swal.fire({
        icon: "success",
        title: "Cliente agregado",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    // Reset formulario y estado
    nuevoCliente.value = {
      dni: "",
      nombre: "",
      apellidos: "",
      email: "",
      movil: "",
      direccion: "",
      provincia: "",
      municipio: "",
      fecha_alta: "",
      tipo_cliente: "",
      historico: true,
      lopd: false,
    };

    editando.value = false;
    clienteEditandoId.value = null;

    // Reset validaciones si tienes (dniValido, movilValido, etc)
    dniValido.value = true;
    movilValido.value = true;
    emailValido.value = true;

    // Refrescar lista completa (opcional)
    clientes.value = await getClientes();
  } catch (error) {
    console.error("Error al guardar cliente:", error);
    Swal.fire({
      icon: "error",
      title: "Error al guardar cliente",
      text: "Inténtelo de nuevo o contacte con el administrador.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

/* Zona Cargar clientes Al Montar el componente ///////////////
onMounted(async () => {
  guardarCliente();
});
*/

// Funcion Eliminar Cliente con patch (histórico a false)
const eliminarCliente = async (movil) => {
  // Refrescar lista desde la API
  clientes.value = await getClientes();
  // Buscar cliente completo (que incluye el ID)
  const clienteAEliminar = clientes.value.find(
    (cliente) => cliente.movil === movil
  );

  if (!clienteAEliminar) {
    Swal.fire({
      icon: "error",
      title: "Cliente no encontrado",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  // Pedir confirmación antes de eliminar
  const result = await Swal.fire({
    title: `¿Eliminar al cliente ${clienteAEliminar.nombre} ${clienteAEliminar.apellidos}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  // Si no confirma, salir
  if (!result.isConfirmed) return;

  // Si confirma, eliminar cliente usando la API y movil como ID
  await deleteCliente(clienteAEliminar.id);
  // Refrescar la lista desde la "API"
  clientes.value = await getClientes();

  Swal.fire({
    icon: "success",
    title: "Cliente eliminado",
    showConfirmButton: false,
    timer: 1500,
  });
};

/* Cargar clientes al montar el componente /////////////////////////*/
onMounted(async () => {
  clientes.value = await getClientes();
  Swal.fire({
    icon: "success",
    title: "Listando Clientes...",
    showConfirmButton: false,
    timer: 1500,
  });
});

// Función Editar Cliente (carga datos en el formulario)
const editarCliente = (movil) => {
  const cliente = clientes.value.find((c) => c.movil === movil);
  if (!cliente) {
    Swal.fire({
      icon: "error",
      title: "Cliente no encontrado",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  // Detectar si fecha ya está en ISO o no, y convertir solo si es necesario
  let fechaFormateada = cliente.fecha_alta;
  if (fechaFormateada && fechaFormateada.includes("/")) {
    fechaFormateada = formatearFechaParaInput(fechaFormateada);
  }
  nuevoCliente.value = { ...cliente, fecha_alta: fechaFormateada };
  editando.value = true;
  filtrarMunicipios();
  clienteEditandoId.value = cliente.id;
};

///////////////Función para activar cliente (poner historico en true)
const activarCliente = async (cliente) => {
  const confirmacion = await Swal.fire({
    title: `¿Activar cliente ${cliente.nombre} ${cliente.apellidos}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Activar",
    cancelButtonText: "Cancelar",
  });

  if (!confirmacion.isConfirmed) return;

  try {
    // Crear una copia del cliente con historico en true
    const clienteActivado = { ...cliente, historico: true };

    // Llamar a la API para actualizar
    const actualizado = await updateCliente(cliente.id, clienteActivado);

    // Actualizar la lista local (opcional, también puedes volver a cargar todo)
    const index = clientes.value.findIndex((c) => c.id === cliente.id);
    if (index !== -1) {
      clientes.value[index] = actualizado;
    }

    Swal.fire({
      icon: "success",
      title: "Cliente reactivado",
      showConfirmButton: false,
      timer: 1500,
    });

    // Recargar lista actualizada
    await cargarClientes();
  } catch (error) {
    console.error("Error al reactivar cliente:", error);
    Swal.fire({
      icon: "error",
      title: "Error al activar cliente",
      text: "Por favor, intenta de nuevo.",
      timer: 1500,
    });
  }
};

///CODIGO BUSQUEDA COMPONENTES

const buscarClientePorDNI = async (dni) => {
  if (!dni || dni.trim() === "") {
    Swal.fire({
      icon: "warning",
      title: "Debe introducir un DNI antes de buscar.",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  try {
    const cliente = await getClientePorDni(dni.trim().toUpperCase());
    console.log(cliente.value);
    if (!cliente) {
      Swal.fire({
        icon: "info",
        title: "Cliente no encontrado",
        text: "No existe ningún cliente con ese DNI.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    // ✅ Cargar los datos en el formulario
    nuevoCliente.value = { ...cliente };
    nuevoCliente.value.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);
    editando.value = true;

    // Actualiza lista de municipios si cambia la provincia
    filtrarMunicipios();
    //opcional
    clienteEditandoId.value = cliente.id;
    nuevoCliente.value.municipio = cliente.municipio;

    Swal.fire({
      icon: "success",
      title: "Cliente encontrado y cargado",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error buscando cliente por DNI:", error);
    Swal.fire({
      icon: "error",
      title: "Error al buscar cliente",
      text: "Verifique la conexión o contacte con el administrador.",
      timer: 2000,
      showConfirmButton: false,
    });
  }
};

const capitalizarTexto = (propiedad) => {
  if (!nuevoCliente.value[propiedad]) return;
  nuevoCliente.value[propiedad] = nuevoCliente.value[propiedad]
    .split(" ")
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    )
    .join(" ");
};

/////////////////////SCRIPTS AUXILIARES /////////////////////////////////
const dniValido = ref(true); // Por defecto es válido y no muestra error al iniciar
const emailValido = ref(true);

// conversor fecha
const formatearFechaParaInput = (fecha) => {
  if (!fecha) return "";
  const partes = fecha.split("/");
  if (partes.length !== 3) return "";
  // partes = [dd, mm, yyyy]
  return `${partes[2]}-${partes[1].padStart(2, "0")}-${partes[0].padStart(
    2,
    "0"
  )}`;
};

///// VALIDACIONES

//Validar email
const validarEmail = () => {
  const email = nuevoCliente.value.email.trim();
  // Expresión simple para email válido
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailValido.value = regex.test(email);
};

// Estado de validez del DNI/NIE si la estructura de datos es más compleja se usa reactive

// Función para validar DNI y NIE
const validarDniNie = (valor) => {
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

  valor = valor.toUpperCase();

  if (dniRegex.test(valor)) {
    const numero = parseInt(valor.slice(0, 8), 10);
    const letra = valor.charAt(8);
    return letra === letras[numero % 23]; //sale con true si es válido
  } else if (nieRegex.test(valor)) {
    const nie = valor.replace("X", "0").replace("Y", "1").replace("Z", "2");
    const numero = parseInt(nie.slice(0, 8), 10);
    const letra = valor.charAt(8);
    return letra === letras[numero % 23]; //sale con true si es válido
  }
  return false;
};

// Validar al salir del campo
const validarDni = () => {
  nuevoCliente.value.dni = nuevoCliente.value.dni.trim().toUpperCase();
  dniValido.value = validarDniNie(nuevoCliente.value.dni);
};

// Control móvil
const movilValido = ref(true);
const movilRegex = /^[67]\d{8}$/;

const validarMovil = () => {
  const movil = nuevoCliente.value.movil.trim();

  if (movil === "") {
    movilValido.value = true; // Vacío = válido (opcional)
    return true;
  }

  if (movil.charAt(0) === "6" || movil.charAt(0) === "7") {
    movilValido.value = movilRegex.test(movil);
    return movilValido.value;
  } else {
    movilValido.value = false;
    return false;
  }
};

// Función para resetear el formulario
const resetForm = () => {
  // Reiniciar el formulario
  nuevoCliente.value = {
    dni: "",
    nombre: "",
    apellidos: "",
    email: "",
    movil: "",
    direccion: "",
    provincia: "",
    municipio: "",
    fecha_alta: "",
    historico: true,
    password: "",
  };
  // Resetear estado de edición
  editando.value = false;
  clienteEditandoId.value = null;
  // Resetear validaciones
  dniValido.value = true;
  movilValido.value = true;
  emailValido.value = true;
  // Resetear aceptación de términos
  acepta.value = false;
};

// Provincias y municipios

const provincias = ref(provmuniData.provincias); // Array de provincias
const municipios = ref(provmuniData.municipios); // Array de municipios para filtrarlos
const municipiosFiltrados = ref([]); // vacío pero contendrá los municipios filtrados

const filtrarMunicipios = () => {
  // nombre de la provincia elegida en el <select>
  const nombreProv = nuevoCliente.value.provincia;

  // 1️⃣ buscar en provincias el objeto con ese nombre
  const prov = provincias.value.find((p) => p.nm === nombreProv);
  if (!prov) {
    municipiosFiltrados.value = [];
    return;
  }

  // 2️⃣ los dos primeros dígitos del id de la provincia
  const codigoProv = prov.id.slice(0, 2);

  // 3️⃣ filtrar los municipios cuyo id empiece por esos dos dígitos
  municipiosFiltrados.value = municipios.value.filter((m) =>
    m.id.startsWith(codigoProv)
  );

  // 4️⃣ opcional: resetear el municipio si ya no corresponde
  nuevoCliente.value.municipio = "";
};
</script>

<style scoped>
.is-invalid {
  border-color: #f28b82 !important;
  background-color: #ffe6e6;
}

.invalid-feedback {
  display: block;
}

#app
  > main
  > div
  > form
  > div:nth-child(2)
  > div.col-md-6.d-flex.align-items-center.ms-auto {
  margin-left: 48px !important;
}

.gestion-clientes {
  width: 95%;
  max-width: none;
  margin: 0 auto;
  padding: 2rem 0;
}

.form-control {
  width: 100%;
}

/* Centrar el botón de guardar de forma absoluta dentro de su fila */
.center-button {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* Asegura que el área del botón no corte a otros elementos */
  z-index: 1;
}
</style>
