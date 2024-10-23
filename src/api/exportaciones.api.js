import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL;

export const getAllExportaciones = () => {
  const res = axios.get(`${API_URL}/exportaciones/api/exportaciones/`)
  return res
}