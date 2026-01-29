<template>
  <div
    class="success-container d-flex justify-content-center align-items-center"
  >
    <div class="success-card card shadow">
      <div class="card-body">
        <h1 class="card-title text-success">Pago Completado!</h1>
        <p class="card-text text-muted">
          Muchas gracias por tu compra. Te hemos enviado un correo con los
          detalles.
        </p>
        <div class="invoice-container mt-4">
          <p class="text-muted">Descargue su factura en formato PDF:</p>
          <button @click="generarFacturaPDF" class="btn btn-primary mb-2">
            <i class="bi bi-file-earmark-pdf"></i> Descargar Factura
          </button>
          <router-link to="/" class="btn btn-outline-primary">
            <i class="bi bi-arrow-left"></i> Volver a la tienda
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useCestaStore } from "@/store/cesta.js";
import { watch, toRefs } from "vue";
import logo from "@/assets/logo.svg"; // Importa la imagen del logo
export default {
  data() {
    return {
      totalItems: [],
      totalPrecio: 0,
      //otros datos como el cliente, dirección, email, etc.
    };
  },

  mounted() {
    const cartStore = useCestaStore();
    const { items } = toRefs(cartStore); // Obten los items del carrito desde el store de Pinia
    // y tambien la variable totalPrice desde el getter del store
    console.log("Items en el carrito:", items.value);
    this.totalItems = JSON.parse(JSON.stringify(items.value));

    this.totalPrecio = cartStore.totalPrecio;

    // Usar un watch para actualizar cartitems cuando cambian
    watch(
      () => cartStore.items,
      (newVal) => {
        this.totalItems = newVal;
      },
      { deep: true },
    );
  },

  methods: {
    generarFacturaPDF() {
      const doc = new jsPDF();
      const cart = this.totalItems;
      console.log("Generando factura para los siguientes productos:", cart);

      if (this.totalItems.length == 0) {
        console.error(
          "No hay productos en el carrito. No se puede generar la factura.",
        );
        return;
      }

      // Logo en la parte superior izquierda (ajustar la ruta de tu logo)
      doc.addImage(logo, "png", 10, 10, 20, 20); // Ajusta las coordenadas y tamaño

      // Titulo de la factura
      doc.setFontSize(18);
      doc.text("Factura de Compra", 60, 20); // Alineado a la derecha del logo

      // Información del cliente
      doc.setFontSize(9);
      doc.text("Razón Social: Regalos Teis", 110, 50);
      doc.text("Dirección: Avenida Galicia 101, Vigo - 36216", 110, 55);
      doc.text("Tlfo: 986 666 333 Email: regalos@example.com", 110, 60);

      // Crear la tabla con los productos del carrito
      const headers = [
        ["ID", "Producto", "Cantidad", "Precio Unitario", "Total"],
      ];
      const data = cart.map((item) => [
        item.id,
        item.nombre,
        item.cantidad,
        `${item.precio.toFixed(2)} €`, // Formatear precio unitario
        `${(item.cantidad * item.precio).toFixed(2)} €`, // Formatear total
      ]);

      doc.autoTable({
        startY: 80,
        head: headers,
        body: data,
        columnStyles: {
          0: { halign: "center" }, // Alinear ID al centro
          2: { halign: "center" }, // Alinear Cantidad al centro
          3: { halign: "right" }, // Alinear Precio Unitario a la derecha
          4: { halign: "right" }, // Alinear Total a la derecha
        },
        theme: "striped", // Estilo de la tabla con líneas de fondo alternadas
      });

      // Total de la compra (alineado a la derecha)
      const totalText = `Total: ${this.totalItems
        .reduce((acc, item) => acc + item.precio * item.cantidad, 0)
        .toFixed(2)} €`;

      // Obtener el ancho de la página
      const pageWidth = doc.internal.pageSize.width;

      // Calcular la posición X para alinear a la derecha
      const totalWidth = doc.getTextWidth(totalText);
      const positionX = pageWidth - totalWidth - 14; // Resta 14 para margen desde el borde derecho
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      // Colocar el texto en la posición calculada
      doc.text(totalText, positionX - 9, doc.lastAutoTable.finalY + 10);

      // Guardar el archivo PDF
      doc.save("factura.pdf");
    },
  },
  /*
  beforeUnmount() {
    // Eliminar los datos del carrito después de mostrar la factura
    const cartStore = useCestaStore();
    cartStore.clearCesta();
  }, */
};
</script>
<style scoped>
.success-container {
  min-height: 80vh;
  padding: 20px;
}

.success-card {
  max-width: 500px;
  border-radius: 8px;
}

.invoice-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

router-link {
  text-decoration: none;
}
</style>
