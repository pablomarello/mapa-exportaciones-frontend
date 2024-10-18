import { useEffect, useRef, useState } from 'react';
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { ZoomControl } from 'react-leaflet/ZoomControl';
import { Marker } from 'react-leaflet/Marker';
import { Popup, Polyline, GeoJSON } from 'react-leaflet';
import { Card } from './Card';
import { CardCatamarca } from './CardCatamarca';
import { Icon } from './Icon';
import { faFilter, faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { Modal } from './Modal';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import '@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.css';
import '@ansur/leaflet-pulse-icon';
import * as L from 'leaflet';
import '../libs/MovingMarker';
import containerIconAzul from '../assets/img/container_azul.png';
import provinciasData from '../data/provincia.json';
import { getAllExportaciones } from '../api/exportaciones.api';

export const MapCard = () => {
  const [exportaciones, setExportaciones] = useState([]);
  const [originalExportaciones, setOriginalExportaciones] = useState([]);
  const [zoom, setZoom] = useState(19);
  const mapRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredCoords, setFilteredCoords] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const movingMarkerRef = useRef(null);
  const [totalFobDolar, setTotalFobDolar] = useState(0);
  const [totalPesoNeto, setTotalPesoNeto] = useState(0);
  const [filteredYear, setFilteredYear] = useState('2023');  // Estado para el año
  const [uniqueYears, setUniqueYears] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueCountries, setUniqueCountries] = useState([]);
  

  useEffect(() => {
    getAllExportaciones()
      .then((response) => {
        const exportacionesData = response.data;

        if (Array.isArray(exportacionesData)) {
          const validExportaciones = exportacionesData.filter(
            (exportacion) => exportacion.destino && exportacion.destino.coordenadas
          );

       

          setExportaciones(validExportaciones);
          setOriginalExportaciones(validExportaciones); 

            
            const years = [...new Set(validExportaciones.map(exp => exp.año))].sort((a, b) => b - a);
            setUniqueYears(years);

            
            const countries = [...new Set(validExportaciones.map(exp => exp.destino.nombre))];
            setUniqueCountries(countries);

        } else {
          console.error('Los datos recibidos no son un array:', exportacionesData);
          setExportaciones([]);
        }
      })
      .catch((error) => {
        console.error('Error al obtener exportaciones:', error);
        setExportaciones([]);
      });
  }, []);

  
  useEffect(() => {
    const filteredExportaciones = originalExportaciones.filter(
      exp => exp.año === Number(filteredYear)
  );

  const totalFob = filteredExportaciones.reduce((sum, exp) => sum + exp.fob_dolar, 0);
  const totalPeso = filteredExportaciones.reduce((sum, exp) => sum + exp.peso_neto, 0);

  setTotalFobDolar(totalFob);
  setTotalPesoNeto(totalPeso);
}, [filteredYear, originalExportaciones]);

  useEffect(() => {
    const catamarcaData = provinciasData.features.filter(
      feature => feature.properties.nam === 'Catamarca'
    );
    const catamarcaGeoJson = {
      type: 'FeatureCollection',
      features: catamarcaData,
    };
    setGeoJsonData(catamarcaGeoJson);
  }, []);

  const geoJsonStyle = {
    color: 'red',
    weight: 2,
    fillOpacity: 0.2,
  };

  useEffect(() => {
    if (exportaciones.length > 0) {
      let coords = exportaciones.map(exp => [exp.destino.coordenadas[1], exp.destino.coordenadas[0]]);
      const bounds = L.latLngBounds(coords);
      mapRef.current.fitBounds(bounds);
      const zoom = mapRef.current.getBoundsZoom(coords);

      if (coords.length === 1) {
        mapRef.current.fitBounds(bounds);
        mapRef.current.fitBounds(L.latLngBounds(boundCoords));
      } else if (coords.length > 1) {
        mapRef.current.setZoom(zoom);
      }
    }
  }, [exportaciones]);

  const filterData = () => {
    let data = originalExportaciones;
    if(filteredYear){
      data = data.filter(exp => exp.año === Number(filteredYear));
    }

    // Actualizar los países únicos basados en las exportaciones filtradas por año
    const countries = [...new Set(data.map(exp => exp.destino.nombre))];
    setUniqueCountries(countries); // Actualizar el select de países según las exportaciones filtradas por año

    if (selectedCountry) {
      data = data.filter(exp => exp.destino.nombre === selectedCountry);
    }
    setFilteredData(data);

    // Si se selecciona "Todos los países", restaurar los datos originales
    if(selectedCountry === ''){
      setExportaciones(originalExportaciones);
      setFilteredCoords(null);
    }
    
  };

  useEffect(() => {
    filterData();
  }, [selectedCountry,filteredYear]);

  useEffect(() => {
    
    if (filteredData.length > 0) {
      setFilteredCoords([filteredData[0].destino.coordenadas[1], filteredData[0].destino.coordenadas[0]]);
    } else {
      setFilteredCoords(null);
    }
  }, [filteredData])

  useEffect(() => {
    setFilteredData(originalExportaciones)
  }, [originalExportaciones])
  

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleYearChange = (e) => {
    setFilteredYear(e.target.value);
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fixedPoint = [-28.46957, -65.78524];

  const fixedPulseIcon = L.icon.pulse({
    iconSize: [12, 12],
    color: 'red'
  });

  const movingMarkerIcon = L.icon({
    iconUrl: containerIconAzul,
    iconSize: [60, 80],
    iconAnchor: [30, 95]
  });

  useEffect(() => {
    if (filteredCoords && selectedCountry) {
      // Solo crear y animar el marcador si se seleccionó un país
      if (movingMarkerRef.current) {
        movingMarkerRef.current.removeFrom(mapRef.current);
      }
  
      const bounds = L.latLngBounds([fixedPoint, filteredCoords]); // Incluir Catamarca y el país filtrado
      mapRef.current.fitBounds(bounds); // Ajuste de los límites del mapa
  
      const movingMarker = L.Marker.movingMarker(
        [fixedPoint, filteredCoords],
        [5000],
        { icon: movingMarkerIcon }
      ).addTo(mapRef.current);
  
      movingMarker.start();
      movingMarkerRef.current = movingMarker;
    } else if (movingMarkerRef.current) {
      // Remover la animación si no hay un país seleccionado
      movingMarkerRef.current.removeFrom(mapRef.current);
      movingMarkerRef.current = null;
    }
  }, [filteredCoords, selectedCountry]);
  
  return (
    <>
      <div className="absolute bottom-36 left-4 z-10 p-2 bg-white text-black shadow-lg rounded-md font-neue border border-black">
        <span className="block">Total FOB Dólar: {totalFobDolar.toLocaleString()} USD</span>
        <span className="block">Total Peso Neto: {totalPesoNeto.toLocaleString()} Kg</span>
      </div>
      <div className="absolute top-20 left-4 z-10 font-neue">
        <button className="p-2 bg-azulclaro text-white shadow-lg rounded-md flex items-center" onClick={toggleModal}>
          <span className="mr-2">
            <Icon icon={faFilter} />
          </span>
          <span>Filtros</span>
        </button>

        
        
        <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div className="p-4">
        <label htmlFor="pais" className="block text-sm font-medium text-gray-700">
                Año:
              </label>
          <select
            value={filteredYear}
            onChange={handleYearChange}
            className="p-2 border border-gray-400 rounded"
          >
            
            {uniqueYears.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
        </div>
            <div className="p-4">
              <label htmlFor="pais" className="block text-sm font-medium text-gray-700">
                País:
              </label>
            <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="p-2 border border-gray-400 rounded ml-2"
            disabled={!filteredYear} // Deshabilitar el select de país si no hay un año seleccionado
          >
            <option value="">Todos los países</option>
            {uniqueCountries.sort((a, b) => a.localeCompare(b)).map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>

            
          </div>
        </Modal>
      </div>

      <div className="absolute top-20 left-32 z-10 font-neue">
      <Link to="/estadistica">
        <button className="p-2 bg-azulclaro text-white shadow-lg rounded-md flex items-center">
        <span className="mr-2">
            <Icon icon={faChartSimple} />
          </span>
          <span>Estadística</span>
        </button>
        </Link>
      </div>

      <div className="relative w-full h-[77.4vh] z-0">
        <MapContainer className="h-full" zoom={zoom} zoomControl={false} ref={mapRef}>
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          />
          <ZoomControl position='bottomright' />
          {geoJsonData && <GeoJSON data={geoJsonData} style={geoJsonStyle} />}
          <Marker
            position={fixedPoint}
            icon={fixedPulseIcon}
          >
            <Popup className="w-80">
              <CardCatamarca />
            </Popup>
          </Marker>
          {filteredData.map((exp, index) => {
            const pulseIcon = L.icon.pulse({
              iconSize: [12, 12],
              color: 'blue',
              fillColor: 'blue'
            });

            // Filtrar las exportaciones por el mismo destino Y por el año seleccionado
            const exportacionesMismoDestino = filteredData.filter(e => e.destino.nombre === exp.destino.nombre);
            // Filtrar las 3 exportaciones con mayor fob_dolar para el destino seleccionado
            const top3Exportaciones = exportacionesMismoDestino
            .sort((a, b) => b.fob_dolar - a.fob_dolar)
            .slice(0, 3);

            return (
              <Marker
                key={index}
                position={[exp.destino.coordenadas[1], exp.destino.coordenadas[0]]}
                icon={pulseIcon}
              >
                <Popup key={index} className="w-80">
                  
                  <Card exportaciones={top3Exportaciones} />
                </Popup>
              </Marker>
            );
          })}
          {selectedCountry && filteredCoords && (
            <Polyline
              positions={[fixedPoint, filteredCoords]}
              color="red"
            />
          )}
        </MapContainer>
      </div>
    </>
  );
};
