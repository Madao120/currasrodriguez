<template>
  <div class="container mt-4">
    <h2 Mi Cesta></h2>
    <div v-if="cesta.items.length === 0" class="alert alert-info">
      La cesta está vacía.
    </div>
    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cesta.items" :key="item.id">
            <td>{{ item.nombre }}</td>
            <td>{{ item.precio }} €</td>
            <td>
              <button
                class="btn btn-sm btn-outline-secondary me-1"
                @click="decrementar(item.id)"
              >
                -
              </button>
              {{ item.cantidad }}
              <button
                class="btn btn-sm btn-outline-secondary ms-1"
                @click="incrementar(item.id)"
              >
                +
              </button>
            </td>
            <td>{{ item.precio * item.cantidad }} €</td>
            <td>
              <button
                class="btn btn-sm btn-danger"
                @click="removeProducto(item.id)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Código de descuento"
                v-model="codigoDescuento"
              />
            </td>
          </tr>
          <tr class="fw-bold">
            <td colspan="3" class="text-end">Total</td>
            <td>{{ precioFinal }} €</td>
            <td class="d-flex justify-center align-center flex-row">
              <button
                :disabled="!isLogueado"
                class="btn btn-success btn-sm justify-content-end px-3"
                @click="iniciarPago"
              >
                Pago
              </button>
            </td>
          </tr>
          <tr v-if="!isLogueado">
            <td colspan="5" class="text-end text-danger fw-bold">
              Debes de iniciar la sesión para proceder al pago
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCestaStore } from "@/store/cesta.js";
import axios from "axios";
import Swal from "sweetalert2";
// import isLogueado from "./NavBar.vue";

const cesta = useCestaStore();
const isLogueado = sessionStorage.getItem("token") !== null;

// Código de descuento
const codigoDescuento = ref(cesta.codigoDescuento);

// Precio final con descuento aplicado
const precioFinal = ref(cesta.precioFinal);

const incrementar = (id) => cesta.incrementarCantidad(id);
const decrementar = (id) => cesta.decrementarCantidad(id);
const removeProducto = (id) => cesta.removeProducto(id);

// Iniciar pago con Stripe usando axios
const iniciarPago = async () => {
  if (!cesta.items.length) {
    Swal.fire("Aviso", "La cesta está vacía", "warning");
    return;
  }
  if (sessionStorage.getItem("token") === null) {
    Swal.fire("Aviso", "Debes iniciar sesión para realizar el pago", "warning");
    return;
  }
  /*if(!isLogueado){
    Swal.fire("Aviso", "Debes iniciar sesión para realizar el pago", "warning");
    return;
  } */
  try {
    console.log("Compra completada y guardada");

    // Crear la sesión de pago en el backend
    const response = await axios.post(
      "http://localhost:5000/crear-checkout-session",
      {
        items: cesta.items,
        amount: cesta.precioFinal.value, // Enviar el precio final calculado al backend
      },
    );

    const session = response.data;

    if (!session.url) {
      console.error("X No se recibio URL de Stripe.");
      Swal.fire("Error", "No se pudo iniciar el pago", "error");
      return;
    }
    // Redirigir directamente al checkout de Stripe
    window.location.href = session.url;
  } catch (error) {
    console.error("Error en iniciarPago:", error);
    Swal.fire("Error", "No se pudo iniciar el pago", "error");
  }
};
</script>
<style scoped></style>
