import axios from 'axios'

export const getAllExportaciones = async () => {
  const response = await axios.get('http://localhost:8000/exportaciones/api/exportaciones/');
  return response.data;
}