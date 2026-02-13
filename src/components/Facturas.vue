<template>
  <h4
    class="text-center my-2 bg-`primary-subtle py-1 border bg-primary bg-opacity-25 text-primary p-3 rounded"
  >
    <i class="bi bi-newspaper me-2"></i> Facturas
  </h4>
  <table
    class="table table-bordered table-striped table-sm table-hover align-middle"
  >
    <thead>
      <tr class="table-primary text-center">
        <th>Factura</th>
        <th>Fecha</th>
        <th>Modelo</th>
        <th>Precio</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="factura in facturas" :key="factura._id" class="text-center">
        <td>{{ factura._id }}</td>
        <td>{{ factura.fecha }}</td>
        <td>{{ factura.productos[0].nombre }}</td>
        <td>{{ factura.productos[0].precio_unitario }} €</td>
        <td>{{ factura.total }} €</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
// import { getFacturas } from "../api/facturas";
import { ref, computed, watch, onMounted } from "vue";
import { getFacturas } from "../api/facturas";

const facturas = ref();

onMounted(async () => {
  facturas.value = await getFacturas();
});
/*
onMounted(async () => {
  facturas.value = await getFacturas();
});
*/
</script>
<style scoped></style>
