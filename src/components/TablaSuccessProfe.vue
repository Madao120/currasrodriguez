<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useCestaStore } from "@/store/cesta";
import { crearFactura } from "@/api/facturaServicios";

import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";

const cartStore = useCestaStore();

const cartItems = ref([]);
const totalPrice = ref(0);
const facturaID = ref(null);

const dni = sessionStorage.getItem("userDni") || "";

/* ---------------------------
   OBTENER CLIENTE DESDE JSON-SERVER
--------------------------- */
async function obtenerClienteDesdeJsonServer() {
  try {
    const response = await axios.get(
      `http://localhost:3000/clientes?dni=${dni}`,
    );
    return response.data[0] || null;
  } catch (error) {
    console.error("Error cargando cliente:", error);
    return null;
  }
}

/* -------------------
   CICLO DE VIDA
------------------- */
onMounted(async () => {
  const savedItems = localStorage.getItem("checkout_items");
  const savedTotal = localStorage.getItem("checkout_total");

  if (!savedItems) {
    Swal.fire("Cesta vacía", "No se encontraron datos del pedido", "warning");
    return;
  }

  cartItems.value = JSON.parse(savedItems);
  totalPrice.value = Number(savedTotal);

  if (!cartItems.value.length) {
    Swal.fire("Cesta vacía", "No hay productos en la cesta", "warning");
    return;
  }

  await confirmarPago();
});

async function confirmarPago() {
  try {
    const totalFactura = cartItems.value.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0,
    );

    const facturaData = {
      items: cartItems.value.map((item) => ({
        productoId: item._id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        total: item.precio * item.cantidad,
      })),
      totalFactura,
      fecha: new Date().toISOString(),
    };

    const data = await crearFactura(facturaData);

    facturaID.value = data?.factura?._id ?? null;
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo confirmar el pago", "error");
  }
}

async function generarFacturaPDF() {
  if (!cartItems.value.length) {
    Swal.fire({
      icon: "warning",
      title: "Cesta vacía",
      text: "No hay productos en la cesta para generar la factura.",
    });
    return;
  }

  // **OBTENER CLIENTE**
  const cliente = await obtenerClienteDesdeJsonServer();

  const clienteApi = {
    dni: cliente?.dni || "N/A",
    nombre: cliente?.nombre || "Cliente",
    apellidos: cliente?.apellidos || "",
    email: cliente?.email || "",
  };

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Factura de Compra", 60, 20);
  doc.setFontSize(12);

  doc.setFontSize(9);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 125, 35);
  doc.text(`Nº Factura: ${facturaID.value}`, 125, 30);
  doc.text(`DNI: ${clienteApi.dni}`, 15, 45);
  doc.text(`Cliente: ${clienteApi.nombre} ${clienteApi.apellidos}`, 15, 50);
  doc.text(`Email: ${clienteApi.email}`, 15, 55);

  doc.autoTable({
    startY: 70,
    head: [["Producto", "Cantidad", "Precio", "Total"]],
    body: cartItems.value.map((p) => [
      p.nombre,
      p.cantidad,
      `${p.precio.toFixed(2)} €`,
      `${(p.precio * p.cantidad).toFixed(2)} €`,
    ]),
  });

  const total = cartItems.value.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${total.toFixed(2)} €`, 150, doc.lastAutoTable.finalY + 10);

  doc.save(`factura_${facturaID.value}.pdf`);

  cartStore.clearCesta();
  localStorage.removeItem("checkout_items");
  localStorage.removeItem("checkout_total");
}
</script>
