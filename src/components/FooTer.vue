<template>
  <footer class="navbar navbar-dark bg-primary position-sticky top-0">
    <div class="container">
      <p class="mb-1 text-light">
        &copy; {{ new Date().getFullYear() }} MiSitio. Todos los derechos
        reservados.
      </p>
      <ul class="list-inline mb-0">
        <router-link
          to="/aviso-legal"
          target="_blank"
          class="ms-2 nav-link text-light d-inline me-2"
          >Aviso legal</router-link
        >
        <router-link
          to="/politica-privacidad"
          target="_blank"
          class="ms-2 nav-link text-light d-inline me-2"
          >Política de privacidad</router-link
        >
        <li class="list-inline-item">
          <a href="#" class="text-light text-decoration-none">Contacto</a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup></script>
