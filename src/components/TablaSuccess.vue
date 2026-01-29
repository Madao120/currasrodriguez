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
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useCestaStore } from "@/store/cesta.js";
import { watch, toRefs } from "vue";
import Swal from "sweetalert2";
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

    // Intentar recuperar la cesta desde localStorage (guardada antes del pago en Stripe)
    const carroRecuperado = cartStore.recuperarCestaLocalStorage();
    console.log("Carrito recuperado de localStorage:", carroRecuperado);

    const { items } = toRefs(cartStore);
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
    async generarFacturaPDF() {
      const doc = new jsPDF();
      const cart = this.totalItems;
      console.log("Generando factura para los siguientes productos:", cart);

      if (this.totalItems.length == 0) {
        Swal.fire(
          "Advertencia",
          "No hay productos en el carrito. No se puede generar la factura.",
          "warning",
        );
        console.error(
          "No hay productos en el carrito. No se puede generar la factura.",
        );
        return;
      }

      // Intentar cargar el logo (PNG)
      try {
        const logoResponse = await fetch(
          new URL("@/assets/car.png", import.meta.url).href,
        );
        if (logoResponse.ok) {
          const logoBlob = await logoResponse.blob();
          const logoUrl = URL.createObjectURL(logoBlob);
          doc.addImage(logoUrl, "PNG", 10, 10, 20, 20);
          URL.revokeObjectURL(logoUrl);
        }
      } catch (error) {
        console.warn("No se pudo cargar el logo, continuando sin él:", error);
      }

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

      // Usar autoTable si está disponible, si no, crear tabla manualmente
      if (doc.autoTable) {
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
      } else {
        // Fallback: crear tabla manualmente si autoTable no está disponible
        let yPos = 80;
        const lineHeight = 7;
        const colWidth = [15, 60, 20, 30, 30];

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        // Encabezados
        headers[0].forEach((header, i) => {
          doc.text(
            header,
            10 + colWidth.slice(0, i).reduce((a, b) => a + b, 0),
            yPos,
          );
        });

        // Línea separadora
        yPos += lineHeight;
        doc.line(10, yPos, 195, yPos);

        // Datos
        doc.setFont("helvetica", "normal");
        yPos += lineHeight;
        data.forEach((row) => {
          row.forEach((cell, i) => {
            doc.text(
              String(cell),
              10 + colWidth.slice(0, i).reduce((a, b) => a + b, 0),
              yPos,
            );
          });
          yPos += lineHeight;
        });

        // Línea final
        doc.line(10, yPos, 195, yPos);

        // Total
        const totalText = `Total: ${this.totalItems
          .reduce((acc, item) => acc + item.precio * item.cantidad, 0)
          .toFixed(2)} €`;

        const pageWidth = doc.internal.pageSize.width;
        const totalWidth = doc.getTextWidth(totalText);
        const positionX = pageWidth - totalWidth - 14;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(totalText, positionX - 9, yPos + 10);
      }

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
