import axios from "axios"

export const getAllExportaciones = () => {
  const res = axios.get('http://localhost:8000/exportaciones/api/exportaciones/')
  return res
}