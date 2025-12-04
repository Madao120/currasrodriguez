<template>
  <div id="app">
    <NavBar />
    <main class="flex-grow-1 overflow-auto">
      <router-view />
    </main>
    <Footer class="mt-auto" />
  </div>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
import Footer from "./components/FooTer.vue";
//import { RouterView } from "vue-router";
</script>

<style scoped>
#app {
  max-width: 80%;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
