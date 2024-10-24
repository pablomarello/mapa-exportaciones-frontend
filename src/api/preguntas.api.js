import axios from 'axios'

export const getAllPreguntas = async () => {
  const response = await axios.get(import.meta.env.VITE_API_URL + "/trivia/tri/pregunta");
  return response.data;
};