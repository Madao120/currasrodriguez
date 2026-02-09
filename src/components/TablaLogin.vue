<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center vh-75 mt-5"
  >
    <div class="text-center mb-4">
      <h5
        class="fw-bold text-uppercase text-primary position-relative d-inline-block"
      >
        <i class="bi bi-people-fill me-2 fs-3"></i>
        Iniciar sesión
        <span class="underline-effect"></span>
      </h5>
    </div>

    <div class="border p-4 shadow-sm rounded w-100" style="max-width: 400px">
      <form @submit.prevent="iniciarSesion">
        <div class="mb-3">
          <label for="dni" class="form-label fw-bold">DNI:</label>
          <input
            type="text"
            id="dni"
            autocomplete="off"
            @blur="capitalizarTexto"
            class="form-control text-center"
            v-model="dni"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label fw-bold">Contraseña:</label>
          <input
            type="password"
            id="password"
            autocomplete="new-password"
            class="form-control"
            v-model="pass"
            required
          />
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-primary w-50">
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  </div>
  <div
    class="container-alerta d-flex flex-column justify-content-start align-items-start vh-75 mt-5 p-4 shadow-sm rounded border-radius-15"
  >
    <h2 class="">Cuentas Para Corregir</h2>
    <div class="">
      <h3>Admin</h3>
      <p>DNI: 55555555K</p>
      <p>Contraseña: abc123</p>
    </div>
    <div>
      <h3>User</h3>
      <p>DNI: 12345678Z</p>
      <p>Contraseña: abc123</p>
    </div>
  </div>
</template>

<script>
// DEBE QUEDAR CLARO QUE ESTA É UNHA SIMULACIÓN DE LOGIN PARA FINS DIDÁCTICOS CON JSON-SERVER
// EN NINGÚN CASO DEBE USARSE ESTA IMPLEMENTACIÓN EN PRODUCCIÓN
// PARA UNHA APLICACIÓN REAL, O LOGIN DEBE XESTIONARSE NO LADO DO SERVIDOR CON HTTPS Y JWT SEGURO

import Swal from "sweetalert2";
import { loginUsuario } from "@/api/authApi.js";
//import * as jwtDecode from "jwt-decode";
import { jwtDecode } from "jwt-decode";

export default {
  name: "TablaLogin",
  data() {
    return {
      dni: "",
      pass: "",
    };
  },

  methods: {
    async iniciarSesion() {
      try {
        this.dni = this.dni.toUpperCase().trim();
        this.pass = this.pass.trim();
        if (this.dni === "" || this.pass === "") {
          Swal.fire({
            title: "Campos vacíos",
            text: "Por favor, complete ambos campos.",
            icon: "warning",
            confirmButtonText: "Aceptar",
          });
          return;
        }

        const data = await loginUsuario(this.dni, this.pass);

        const decoded = jwtDecode(data.token);

        // Guardar token y datos del usuario en sessionStorage o sessionStorage
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("isLogueado", "true");
        sessionStorage.setItem(
          "isAdmin",
          decoded.tipo === "admin" ? "true" : "false",
        );
        sessionStorage.setItem(
          "isUser",
          decoded.tipo !== "admin" ? "true" : "false",
        );
        sessionStorage.setItem("userName", data.nombre);
        sessionStorage.setItem("userDNI", this.dni);

        // Redirigir al inicio y recargar para que Navbar se actualice
        this.$router
          .push({ name: "Inicio" })
          .then(() => window.location.reload());

        Swal.fire({
          title: "Bienvenido",
          text: `Hola ${data.nombre}`,
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });
        // Redirigir a la página de inicio y recargar con $router
        // $router se usa para evitar problemas de historial en SPA
        // window.location.reload() recarga la página para reflejar el estado autenticado
      } catch (error) {
        console.error("Error en iniciarSesion:", error);
        Swal.fire({
          title: "Error de autenticación",
          text: "Error usuario o contraseña. Verifica tus credenciales.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    },
  },
};
</script>

<style>
.form-label {
  background-color: transparent !important;
  margin-bottom: 0.5rem;
}

.container-alerta {
  border: 10px solid transparent;
  border-radius: 15px;

  border-image: repeating-linear-gradient(
      45deg,
      #ffd700,
      #ffd700 20px,
      #000000 20px,
      #000000 40px
    )
    10;

  width: 30%;
}
</style>
