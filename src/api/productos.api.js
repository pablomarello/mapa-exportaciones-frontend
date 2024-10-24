import axios from 'axios'

export const getAllExportaciones = async () => {
  const response = await axios.get(import.meta.env.VITE_API_URL + '/exportaciones/api/exportaciones/');
  return response.data;
}