import axios from 'axios'

export const getAllPreguntas = async () => {
  const response = await axios.get("http://localhost:8000/trivia/tri/pregunta");
  return response.data;
};