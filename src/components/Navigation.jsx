import { Link } from "react-router-dom"

export function Navigation() {
  return (
    <div>
      <Link to="/index"><h1>Volver a Inicio</h1></Link>
      
      <Link to="/productos">Productos</Link>
    </div>

  )
}
