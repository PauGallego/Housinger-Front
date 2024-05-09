import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Styles/Ubicacion.css';

const MapaLeafletComponent = () => {
    const [mensajeError, setMensajeError] = useState('');
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);

    useEffect(() => {
        inicializarMapa();
    }, []);

    const buscarEnMapa = () => {
        const direccion = document.getElementById('inputDireccion').value;
        if (!direccion) {
            setMensajeError('Por favor, ingresa una dirección.');
            return;
        }

        fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(direccion))
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const latitud = data[0].lat;
                    const longitud = data[0].lon;
                    map.setView([latitud, longitud], 13);

                    setMensajeError('');

                    if (marker) {
                        map.removeLayer(marker);
                    }

                    const newMarker = L.marker([latitud, longitud]).addTo(map);
                    newMarker.bindPopup("<b>¡Hola!</b><br>Estás aquí.").openPopup();
                    setMarker(newMarker);
                } else {
                    setMensajeError('La dirección no pudo ser encontrada. Por favor, inténtelo de nuevo.');
                }
            })
            .catch(error => {
                console.error('Hubo un error al buscar la dirección:', error);
                setMensajeError('Hubo un error al buscar la dirección. Por favor, inténtelo de nuevo.');
            });
    }

    const inicializarMapa = () => {
        const mapInstance = L.map('map').setView([41.3851, 2.1734], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);
        setMap(mapInstance);
    }

    return (
        <div>
            <h2 className="ajustar font-bold text-lg mt-10 lg:ml-[200px]">Ubicación de la vivienda</h2>
            <input type="text" id="inputDireccion" className="ajustar dirrecion lg:ml-[200px] w-[300px] lg:w-[500px] md:w-[400px]" placeholder="Dirección" />
            <button id="btnBuscar" className="mt-5" onClick={buscarEnMapa}>Buscar en Mapa</button>
            <br />
            <span id="mensaje" className="error-mensaje lg:ml-[200px]">{mensajeError}</span>
            <div id="map" className="ajustar lg:w-[900px] lg:ml-[200px] mt-5"></div>
        </div>
    );
};

export default MapaLeafletComponent;
