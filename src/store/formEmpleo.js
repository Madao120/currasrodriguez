import { defineStore } from "pinia";

export const useFormEmpleoStore = defineStore("formEmpleo", {
  state: () => ({
    datos: {
      nombre: "",
      email: "",
      telefono: "",
      foto: null,
    },
  }),
});
