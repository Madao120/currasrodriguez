import NotFound from "../components/NotFound.vue";
import PaginaInicio from "../components/PaginaInicio.vue";
import GestionClientes from "../components/GestionClientes.vue";
import NotiCias from "../components/NotiCias.vue";
import AvisoLegal from "../components/AvisoLegal.vue";
import PoliticaPrivacidad from "../components/PoliticaPrivacidad.vue";
import CitasTaller from "../components/CitasTaller.vue";
import ModeLos from "../components/ModeLos.vue";
import VenTas from "../components/VenTas.vue";
import TablaLogin from "../components/TablaLogin.vue";
import { createRouter, createWebHistory } from "vue-router";

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
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
