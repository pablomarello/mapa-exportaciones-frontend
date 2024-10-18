export const Card = ({ exportaciones }) => {
  

  
  if (!exportaciones || exportaciones.length === 0) {
    return (
      <div className="w-full p-4 bg-red-200 rounded-lg shadow-lg font-neue">
        <h2 className="text-lg font-semibold mb-2 text-red-700">
          No se han proporcionado exportaciones.
        </h2>
      </div>
    );
  }

  // Encontrar el producto con el mayor FOB Dólar
  const topExportacion = exportaciones.sort((a, b) => b.fob_dolar - a.fob_dolar)[0];
  const destinoNombre = topExportacion.destino.nombre;

  // Obtener el año de la primera exportación
  const anioExportacion = topExportacion.año;

  // Obtener los 3 productos con el mayor FOB Dólar
  const top3Exportaciones = exportaciones
    .sort((a, b) => b.fob_dolar - a.fob_dolar)
    .slice(0, 3);

  return (
    <div className="w-full p-4 bg-gray-300 rounded-lg shadow-lg font-neue">
      {/* Mostrar el nombre del destino y año solo una vez */}
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold mb-2">Destino: {destinoNombre}</h2>
        <span className="text-sm font-medium text-gray-700">Año: {anioExportacion}</span>
      </div>
      {/* Mostrar la imagen del producto con el mayor FOB Dólar */}
      <img
        src={topExportacion.producto.imagen || "/imagenes/default_image.png"}
        alt={`Imagen de producto exportado a ${destinoNombre}`}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />

      {/* Mostrar los productos exportados en una lista numerada */}
      <h2 className="text-md font-bold mb-2">Principales productos exportados:</h2>
      <ol className="list-decimal pl-5">
        {top3Exportaciones.map((exportacion, index) => {
          const producto = exportacion.producto || {};
          const fob_dolar = exportacion.fob_dolar || {};

          return (
            <li key={index} className="text-sm text-black mb-2">
              <div className="flex justify-between font-bold">
                <span>{producto.nombre}</span>
                {/* <span>FOB Dólar: {fob_dolar.toLocaleString()} USD</span> */}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
