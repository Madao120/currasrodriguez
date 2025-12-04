<template>
  <div class="container my-5">
    <!-- 📰 FORMULARIO PARA AÑADIR NOTICIA -->
    <div class="card shadow-sm p-4 mb-5">
      <h4
        class="text-center my-2 bg-`primary-subtle py-1 border bg-primary bg-opacity-25 text-primary p-3 rounded"
      >
        <i class="bi bi-newspaper me-2"></i> Nueva Noticia
      </h4>

      <div class="mb-3">
        <label for="titulo" class="form-label fw-bold">Título:</label>
        <!-- Campo controlado por v-model -> nuevoTitulo -->
        <input
          id="titulo"
          type="text"
          v-model="nuevoTitulo"
          class="form-control shadow-sm"
          placeholder="Escribe el título (máximo 128 caracteres)"
          maxlength="128"
        />
      </div>

      <div class="mb-3">
        <label for="contenido" class="form-label fw-bold">Contenido:</label>
        <!-- Campo controlado por v-model -> nuevoContenido -->
        <textarea
          id="contenido"
          v-model="nuevoContenido"
          class="form-control shadow-sm"
          rows="3"
          placeholder="Escribe el contenido (máximo 256 caracteres)"
          maxlength="256"
        ></textarea>
      </div>

      <div class="text-center">
        <!-- Botón que llama a agregarNoticia() al hacer click -->
        <button class="btn btn-primary fw-bold px-4" @click="agregarNoticia">
          PUBLICAR
        </button>
      </div>
    </div>

    <!-- 🗞️ LISTA DE NOTICIAS EXISTENTES -->
    <h5 class="text-center mb-3">NOTICIAS PUBLICADAS</h5>

    <!-- Si hay noticias mostramos la tabla, si no mostramos un mensaje -->
    <div v-if="noticiasOrdenadas.length">
      <table class="table table-borderless mt-3 table-striped">
        <tbody>
          <!-- Iteramos noticiasOrdenadas (reactivo y ordenado) -->
          <template v-for="noticia in noticiasOrdenadas" :key="noticia.id">
            <!-- Fila 1: título y fecha -->
            <tr>
              <td>
                <div class="d-flex justify-content-between">
                  <!-- Título (estilado) -->
                  <strong class="text-primary">{{ noticia.titulo }}</strong>
                  <!-- Fecha tal como viene en el JSON (YYYY-MM-DD) -->
                  <small class="text-muted">{{ noticia.fecha }}</small>
                </div>
              </td>
            </tr>

            <!-- Fila 2: contenido con posible "Seguir leyendo" y botón eliminar -->
            <tr>
              <td>
                <!-- Texto: se decide con textoTruncado() si mostrar completo o truncado -->
                <span>{{ textoTruncado(noticia) }}</span>

                <div class="float-end">
                  <!-- Mostrar el enlace "Seguir leyendo..." solo si el contenido supera el límite -->
                  <a
                    v-if="noticia.contenido.length > PREVIEW_LIMIT"
                    href="#"
                    @click.prevent="toggleExpand(noticia.id)"
                    class="text-decoration-none me-3"
                  >
                    {{
                      isExpanded[noticia.id]
                        ? "Mostrar menos..."
                        : "Seguir leyendo..."
                    }}
                  </a>

                  <!-- Botón eliminar: ahora justo a la derecha del enlace -->
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="eliminarNoticia(noticia.id)"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Mensaje cuando no hay noticias -->
    <div v-else class="text-center text-muted">
      <p>No hay noticias registradas.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const PREVIEW_LIMIT = 128;
const nuevoTitulo = ref("");
const nuevoContenido = ref("");
const noticias = ref([]);
const isExpanded = ref({});

onMounted(async () => {
  const res = await fetch("http://localhost:3000/noticias");
  noticias.value = await res.json();
});

const noticiasOrdenadas = computed(() =>
  [...noticias.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
);

function truncarTexto(texto, limite = PREVIEW_LIMIT) {
  if (!texto || texto.length <= limite) return texto;
  const truncado = texto.slice(0, limite);
  const ultimoEspacio = truncado.lastIndexOf(" ");
  if (ultimoEspacio === -1) return truncado + "...";
  return truncado.slice(0, ultimoEspacio) + "...";
}

function toggleExpand(id) {
  if (!(id in isExpanded.value)) isExpanded.value[id] = false;
  isExpanded.value[id] = !isExpanded.value[id];
}

function textoTruncado(noticia) {
  if (isExpanded.value[noticia.id]) return noticia.contenido;
  return truncarTexto(noticia.contenido, PREVIEW_LIMIT);
}

//Agregar y guardar en json
async function agregarNoticia() {
  if (!nuevoTitulo.value || !nuevoContenido.value) return;

  const ahora = new Date();

  const nueva = {
    id: String(
      noticias.value.length > 0
        ? Math.max(...noticias.value.map((n) => n.id)) + 1
        : 1
    ),
    titulo: nuevoTitulo.value.trim(),
    contenido: nuevoContenido.value.trim(),
    fecha: ahora.toISOString().slice(0, 10),
  };
  // Confirmación antes de guardar
  const result = await Swal.fire({
    title: "¿Desea Publicar esta noticia?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Publicar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;
  try {
    await axios
      .post("http://localhost:3000/noticias", nueva)
      .then((res) => res.data);
    noticias.value.unshift(nueva);
  } catch (error) {
    console.error("Fallo al añadir la nueva notivcia a la bbdd", error);
    throw error;
  }

  // Limpiar formulario
  nuevoTitulo.value = "";
  nuevoContenido.value = "";
}

async function eliminarNoticia(id) {
  // Confirmación antes de eliminar
  const result = await Swal.fire({
    title: "¿Desea eliminar esta noticia?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;
  try {
    await axios.delete(`http://localhost:3000/noticias/${id}`);
    noticias.value = noticias.value.filter((n) => n.id !== id);
    if (id in isExpanded.value) delete isExpanded.value[id];
  } catch (error) {
    console.error("Fallo al eliminar de la base de datos", error);
  }
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
a {
  font-size: 0.9rem;
}
strong {
  font-size: 1.1rem;
}
</style>
