import axios from "axios";

const API_URL = "http://localhost:3000/noticias";

export const getNoticias = (params = {}) =>
  axios.get(API_URL, { params }).then((res) => res.data);

export const updateNoticia = (id, noticia) =>
  axios.get(`${API_URL}/${id}`, noticia).then((res) => res.data);
