<template>
  <nav class="navbar navbar-dark bg-primary sticky-top navbar-expand-lg">
    <div class="container-fluid">
      <!-- Marca o logo -->
      <a class="navbar-brand" href="/"
        ><img
          src="@/assets/logo.svg"
          href="/"
          style="width: 50px; height: 50px"
        />
        Teis Car</a
      >

      <!-- Botón de hamburguesa en pantallas pequeñas -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Links de navegación -->
      <div
        class="collapse navbar-collapse justify-content-center"
        id="navbarNav"
      >
        <div class="mx-auto">
          <ul class="navbar-nav d-flex justify-content-center w-80">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Inicio</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/clientes" class="nav-link"
                >Clientes</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/NotiCias" class="nav-link"
                >Noticias</router-link
              >
            </li>
            <li v-if="isLogeado" class="nav-item">
              <router-link to="/citas" class="nav-link">Citas</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/modelos" class="nav-link">Modelos</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/ventas" class="nav-link">Ventas</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/contacto" class="nav-link"
                >Contacto</router-link
              >
            </li>
          </ul>
        </div>

        <!-- Dropdown de acceso/registro -->
        <div class="dropdown ms-auto align-items-center d-flex">
          <span v-if="isLogueado" class="text-nowarp text-white text-end">{{
            userName
          }}</span>
          <button
            class="btn btn-primary dropdown-toggle d-flex align-items-center"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person fs-2 me-2"></i>
            <span v-if="isLogueado" class="fw-semibold">{{ userName }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <!-- Mostra “Acceso/Registro” se NON hai usuario logueado -->
            <li v-if="!isLogueado">
              <router-link class="dropdown-item" to="/login"
                >Acceso</router-link
              >
            </li>
            <li v-if="!isLogueado">
              <router-link class="dropdown-item" to="/clientes"
                >Registro</router-link
              >
            </li>
            <!-- Mostra “Cerrar Sesión” se está logueado -->
            <li v-if="isLogueado">
              <router-link class="dropdown-item" to="/clientes"
                >Perfil</router-link
              >
              <a class="dropdown-item" href="#" @click.prevent="logout"
                >Cerrar Sesión</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { esAdmin } from "../api/authApi.js"; // importamos la función que ya tenemos

const isLogueado = ref(false);
const isAdmin = ref(false);
const isUsuario = ref(false);
const userName = ref("");

// Se ejecuta al montar el componente
onMounted(async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    isLogueado.value = false;
    isAdmin.value = false;
    isUsuario.value = false;
    userName.value = "";
    return;
  }

  try {
    // Decidir si es admin usando la función del frontend
    isAdmin.value = await esAdmin();
    isUsuario.value = !isAdmin.value;
    isLogueado.value = true;
    userName.value = sessionStorage.getItem("userName") || "";
  } catch (err) {
    console.error("Error verificando si es admin", err);
    sessionStorage.clear();
    isLogueado.value = false;
    isAdmin.value = false;
    isUsuario.value = false;
    userName.value = "";
  }
});

// Logout
function logout() {
  sessionStorage.clear();
  isLogueado.value = false;
  isAdmin.value = false;
  isUsuario.value = false;
  userName.value = "";
  window.location.href = "/";
}
</script>

<style>
.navbar-dark .nav-link {
  color: rgba(255, 255, 255, 0.9);
}
.navbar-dark .nav-link:hover,
.navbar-dark .nav-link:focus {
  color: #fff;
}
</style>
