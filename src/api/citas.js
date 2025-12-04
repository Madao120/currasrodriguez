import axios from "axios";

export async function getCita() {
  try {
    const res = await axios.get("http://localhost:3000/taller");
    return res.data;
  } catch (error) {
    console.error("Error al hacer el get a la BBDD", error);
  }
}

export async function guardarCita(citas) {
  const res = await axios.post("http://localhost:3000/taller", citas);
  return res.data;
}

export async function deleteCita(id) {
  return axios.delete(`http://localhost:3000/taller/${id}`);
}

export async function updateCita(id, nuevosDatos) {
  return axios.put(`http://localhost:3000/taller/${id}`, nuevosDatos);
}
