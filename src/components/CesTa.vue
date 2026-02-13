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
          <!--
            <td>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Código de descuento"
                v-model="cesta.codigoDescuento"
              />
            </td>
            <td v-if="cesta.isGastosEnvio" class="text-danger">
              Si el pedido supera los 20.000€, no se aplicarán los gastos de
              envío
            </td>
          -->
          <tr class="fw-bold">
            <td
              v-if="cliente.tipo_cliente == 'particular'"
              colspan="4"
              class="justify-content-end text-end"
            >
              IVA 21% {{ cesta.precioFinal * 0.21 }} €
            </td>
            <td v-else colspan="4" class="justify-content-end text-end">
              IVA 10% {{ cesta.precioFinal * 0.1 }} €
            </td>
            <td colspan="2"></td>
          </tr>
          <tr class="fw-bold">
            <td :colspan="3" class="text-end">Total</td>
            <td v-if="cliente.tipo_cliente == 'particular'">
              {{ cesta.precioFinal * 1.21 }} €
            </td>
            <td v-else>{{ cesta.precioFinal * 1.1 }} €</td>
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
import { onMounted, ref } from "vue";
import { useCestaStore } from "@/store/cesta.js";
import axios from "axios";
import Swal from "sweetalert2";
import { getClientePorDni } from "../api/clientes";
// import isLogueado from "./NavBar.vue";

const cesta = useCestaStore();
const isLogueado = sessionStorage.getItem("token") !== null;

const incrementar = (id) => cesta.incrementarCantidad(id);
const decrementar = (id) => cesta.decrementarCantidad(id);
const removeProducto = (id) => cesta.removeProducto(id);

const cliente = ref("");

onMounted(async () => {
  // Obtener el cliente logeado por su DNI
  const userDNI = sessionStorage.getItem("userDNI");
  if (userDNI) {
    try {
      cliente.value = await getClientePorDni(userDNI);
      console.log("Cliente obtenido:", cliente.value);
      if (cliente.tipo_cliente == "particular") {
      }
    } catch (error) {
      console.error("Error obteniendo cliente:", error);
    }
  }
});

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
        amount: cesta.precioFinal,
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
