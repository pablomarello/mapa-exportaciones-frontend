import axios from 'axios'

export const getAllRespuestasIncorrectas = async () => {
  const response = await axios.get(import.meta.env.VITE_API_URL + "/trivia/tri/respuestaincorrecta");
  return response.data;
};

