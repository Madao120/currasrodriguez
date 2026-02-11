import NotFound from "../../src/components/NotFound.vue";
import PaginaInicio from "../../src/components/PaginaInicio.vue";
import GestionClientes from "../../src/components/GestionClientes.vue";
import NotiCias from "../../src/components/NotiCias.vue";
import BusCar from "../../src/components/BusCar.vue";
import AvisoLegal from "../../src/components/AvisoLegal.vue";
import PoliticaPrivacidad from "../../src/components/PoliticaPrivacidad.vue";
import CitasTaller from "../../src/components/CitasTaller.vue";
import ModeLos from "../../src/components/ModeLos.vue";
import VenTas from "../../src/components/VenTas.vue";
import TablaLogin from "../../src/components/TablaLogin.vue";
import CesTa from "../../src/components/CesTa.vue";
import TablaSuccess from "../../src/components/TablaSuccess.vue";
import ReservaVehiculo from "../../src/components/ReservaVehiculo.vue";
import VistaCoche from "../../src/components/VistaCoche.vue";
import CochesOrdenados from "../../src/components/CochesOrdenados.vue";
import FormEmpleo from "../../src/components/FormEmpleo.vue";
import FormEmpleoEnvio from "../../src/components/FormEmpleoEnvio.vue";

import { createRouter, createWebHistory } from "vue-router";
import ConTacto from "../../src/components/ConTacto.vue";

const routes = [
  {
    path: "/",
    name: "Inicio",
    component: PaginaInicio,
  },
  {
    path: "/clientes",
    name: "GestionClientes",
    component: GestionClientes,
  },
  {
    path: "/buscar",
    name: "BusCar",
    component: BusCar,
  },
  {
    path: "/noticias",
    name: "NotiCias",
    component: NotiCias,
  },
  {
    path: "/aviso-legal",
    name: "AvisoLegal",
    component: AvisoLegal,
  },
  {
    path: "/politica-privacidad",
    name: "PoliticaPrivacidad",
    component: PoliticaPrivacidad,
  },
  {
    path: "/citas",
    name: "CitasTaller",
    component: CitasTaller,
  },
  {
    path: "/modelos",
    name: "ModeLos",
    component: ModeLos,
  },
  {
    path: "/ventas",
    name: "VenTas",
    component: VenTas,
  },
  {
    path: "/login",
    name: "TablaLogin",
    component: TablaLogin,
  },
  {
    path: "/contacto",
    name: "ConTacto",
    component: ConTacto,
  },
  {
    path: "/cesta",
    name: "CesTa",
    component: CesTa,
  },
  {
    path: "/success",
    name: "TablaSuccess",
    component: TablaSuccess,
  },
  {
    path: "/reservar/:id",
    name: "ReservaVehiculo",
    component: ReservaVehiculo,
  },
  {
    path: "/ver/:id",
    name: "VistaCoche",
    component: VistaCoche,
  },
  {
    path: "/ordenar-coches",
    name: "CochesOrdenados",
    component: CochesOrdenados,
  },
  {
    path: "/form-empleo",
    name: "FormEmpleo",
    component: FormEmpleo,
  },
  {
    path: "/form-empleo-envio",
    name: "FormEmpleoEnvio",
    component: FormEmpleoEnvio,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = sessionStorage.getItem("token");

  // Si la ruta requiere ser admin
  if (to.meta.requiresAdmin) {
    // Si no hay token → al login
    if (!token) return next({ name: "Login" });

    // Consultar al backend si es admin
    const admin = await esAdmin();

    if (!admin) {
      return next({ name: "Inicio" }); // acceso denegado
    }
  }

  next();
});

export default router;
