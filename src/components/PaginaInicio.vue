<template>
  <div
    class="content-box container-fluid d-flex justify-content-center align-items-center vh-100"
  >
    <div
      class="contenido bg-primary bg-opacity-50 text-center p-4 rounded shadow"
    >
      <div class="title-block mb-4">
        <h1 class="text-white mb-3">Página de inicio</h1>
        <img src="@/assets/car.png" alt="Auto animado" class="img-fluid" />
      </div>
      <form class="w-100">
        <div class="mb-3">
          <label class="form-label text-white">Usuario</label>
          <input
            type="text"
            class="form-control"
            placeholder="Ingrese su Usuario"
          />
        </div>
        <div class="mb-3">
          <label class="form-label text-white">Contraseña</label>
          <input
            type="password"
            class="form-control"
            placeholder="Ingrese su Contraseña"
          />
        </div>
        <button type="submit" class="btn btn-light mt-3">Ingresar</button>
      </form>
    </div>
  </div>
</template>

<script setup></script>
<style scoped>
.content-box {
  background-image: url("@/assets/road-wallpaper.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center bottom;

  height: calc(100dvh - 240px);
}
</style>
