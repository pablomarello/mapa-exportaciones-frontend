import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell  } from 'recharts';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL;

const CustomLegend = () => {
  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      <li>
        <span style={{ color: "#82ca9d", marginRight: 10 }}>■</span> 2023
      </li>
      <li>
        <span style={{ color: "#8884d8", marginRight: 10 }}>■</span> 2024
      </li>
    </ul>
  );
};

// Custom Tooltip for the AreaChart (Productos por rubro)
const CustomTooltipRubro = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label">{`Rubro: ${label}`}</p>
        <p>{`Total de Productos: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for the BarChart (FOB Dólar acumulado por año)
const CustomTooltipFob = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });

    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label">{`Año: ${label}`}</p>
        <p>{`Total FOB Dólar: ${formatter.format(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export const CardEstadistica = () => {
  const [productosData, setProductosData] = useState([]);
  const [fobData, setFobData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2023);
  const [data, setData] = useState([]);
  const [pesoNetoData, setPesoNetoData] = useState([]);


  const rubrosMap = {
    1: 'Minería',
    2: 'Olivícola',
    3: 'Citrícola',
    4: 'Cereales y Oleagionsas',
    5: 'Legumbres',
    6: 'Hortalizas',
    7: 'Textil',
    8: 'Conservas',
    9: 'Vitivinícola',
    10: 'Frutos Secos',
    11: 'Alimenticios',
    12: 'Salud',
    13: 'Bebidas',
    14: 'Otros',
    
  };

  const fetchExportacionesData = async () => {
    try {
      const response = await axios.get(`${API_URL}/exportaciones/api/exportaciones/`);
      const exportaciones = response.data;

      // Productos por Rubro
      const productosPorRubro = exportaciones
        .filter(producto => selectedYear === null || producto.año === selectedYear)
        .reduce((acc, producto) => {
          const rubroId = producto.producto.rubro;
          const rubroNombre = rubrosMap[rubroId] || 'Desconocido';
          acc[rubroNombre] = (acc[rubroNombre] || 0) + 1;
          return acc;
        }, {});

      const productosFormateada = Object.keys(productosPorRubro).map((rubro) => ({
        rubro: rubro,
        total_productos: productosPorRubro[rubro],
      }));

      setProductosData(productosFormateada);

      //Total FOB Dólar por Año
      const fobPorAnio = exportaciones.reduce((acc, exportacion) => {
        const anio = exportacion.año;
        const fob = parseFloat(exportacion.fob_dolar);
        if (!isNaN(fob)) {
          acc[anio] = (acc[anio] || 0) + fob;
        }
        return acc;
      }, {});

      const fobFormateada = Object.keys(fobPorAnio).map((anio) => ({
        año: anio,
        total_fob_dolar: fobPorAnio[anio],
      }));

      setFobData(fobFormateada);

      // Total Peso Neto por Año
      const pesoNetoPorAnio = exportaciones.reduce((acc, exportacion) => {
        const anio = exportacion.año;
        const pesoNeto = parseFloat(exportacion.peso_neto);
        if (!isNaN(pesoNeto)) {
          acc[anio] = (acc[anio] || 0) + pesoNeto;
        }
        return acc;
      }, {});

      const pesoNetoFormateada = Object.keys(pesoNetoPorAnio).map((anio) => ({
        año: anio,
        total_peso_neto: pesoNetoPorAnio[anio],
      }));

      setPesoNetoData(pesoNetoFormateada);

    } catch (error) {
      console.error('Error al obtener los datos de exportaciones:', error);
    }
  };

 
  useEffect(() => {
    
    fetchExportacionesData();
  }, [selectedYear]);

  // Formateadores para los ejes Y
  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) {
      return `${(tickItem / 1000000).toFixed(1)}M`;
    } else if (tickItem >= 1000) {
      return `${(tickItem / 1000).toFixed(1)}K`;
    }
    return tickItem;
  };

  const formatYAxisKg = (tickItem) => {
    if (tickItem >= 1000000) {
      return `${(tickItem / 1000000).toFixed(1)}M Kg`;
    } else if (tickItem >= 1000) {
      return `${(tickItem / 1000).toFixed(1)}K Kg`;
    }
    return tickItem;
  };

  return (
    <div className="container mx-auto">
      <div className="relative font-neue mt-4 md:mt-8">
        <Link to="/mapa" className="text-blue-500 hover:underline">
        <button className="p-2 bg-azulclaro text-white shadow-lg rounded-md flex items-center">
        <span className="mr-2">
            <Icon icon={faArrowLeft} />
          </span>
          <span>Volver al Mapa</span>
        </button>
        </Link>
        </div>
        <h2 className="text-center font-bold text-xl">
          Informe de Exportaciones
        </h2>

      <div className="grid grid-cols-1 gap-4">

        <div>
          <h3 className="text-center">Total FOB Dólar por Año</h3>
          <ResponsiveContainer width="90%" height={400}>
            <BarChart data={fobData} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="año" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={(value) => new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2
                }).format(value)}
              />
              <Legend />
              <Bar dataKey="total_fob_dolar" name="Total FOB Dólar" fill="#C3C840">
                
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-center">Total Peso Neto por Año</h3>
          <ResponsiveContainer width="90%" height={400}>
            <BarChart data={pesoNetoData} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="año" />
              <YAxis tickFormatter={formatYAxisKg} />
              <Tooltip
                formatter={(value) => new Intl.NumberFormat('es-ES', {
                  style: 'decimal',
                  minimumFractionDigits: 2
                }).format(value)}
              />
              <Legend />
              <Bar dataKey="total_peso_neto" name="Total Peso Neto" fill="#C0217E" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
      
    </div>
  );
};