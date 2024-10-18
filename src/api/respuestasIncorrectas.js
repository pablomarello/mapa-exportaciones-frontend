import axios from 'axios'

export const getAllRespuestasIncorrectas = async () => {
  const response = await axios.get("http://localhost:8000/trivia/tri/respuestaincorrecta");
  return response.data;
};

