import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Styles/Ubicacion.css';

// URLs de los iconos del marcador por defecto de Leaflet
const defaultMarkerIcon = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const defaultMarkerIconRetina = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const defaultMarkerShadow = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const MapaLeafletComponent = ({ location, userId }) => {
    const [mensajeError, setMensajeError] = useState('');
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [direccion, setDireccion] = useState(location || '');

    useEffect(() => {
        inicializarMapa();

        const userDataString = localStorage.getItem('userData');
        
        if (userDataString && location) {
            const userData = JSON.parse(userDataString);
            if (userId === userData.userId) {
                localStorage.setItem('ubi', location);
            }
        }
    }, []);

    const buscarEnMapa = () => {
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

                    const newMarker = L.marker([latitud, longitud], { icon: defaultIcon }).addTo(map);
                    newMarker.bindPopup("<b>Propiedad</b>").openPopup();
                    setMarker(newMarker);

                    localStorage.setItem("ubi", direccion);
                } else {
                    setMensajeError('La dirección no pudo ser encontrada');
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

    useEffect(() => {
        if (location && map) {
            inicializarUbicacion();
        }
    }, [location, map]);

    const inicializarUbicacion = () => {
        fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(location))
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

                    const newMarker = L.marker([latitud, longitud], { icon: defaultIcon }).addTo(map);
                    newMarker.bindPopup("<b>Propiedad</b>").openPopup();
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

    const defaultIcon = L.icon({
        iconUrl: defaultMarkerIcon,
        iconRetinaUrl: defaultMarkerIconRetina,
        shadowUrl: defaultMarkerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    let puedeModificarDireccion = false;
    const userDataString = localStorage.getItem('userData');
    
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        puedeModificarDireccion = userId === userData.userId;
        if (!puedeModificarDireccion) {
            let admin = localStorage.getItem("admin");
            if (admin) {
                puedeModificarDireccion = true;
            }
        }
    } else {
        puedeModificarDireccion = false;
    }

    return (
        <div>
            <div className='pl-10 md:pl-0 propitario'>
                <h2 className="ajustar font-bold text-lg mt-10 lg:ml-[200px]">Ubicación de la vivienda</h2>
            </div>
            {puedeModificarDireccion ? (
                <div className='pl-10 md:pl-0'>
                    <div className='md:flex md:items-center md:gap-5'>
                        <input
                            type="text"
                            id="inputDireccion"
                            className="ajustar dirrecion lg:ml-[200px] w-[300px] lg:w-[500px] md:w-[400px]"
                            placeholder="Dirección"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                        />
                        <button id="btnBuscar" className='mt-5 md:mt-0' onClick={buscarEnMapa}>Buscar y Modificar</button>
                    </div>
                </div>
            ) : (
                <p className='ajustar dirrecion lg:ml-[200px] w-[300px] lg:w-[500px] md:w-[400px]'>{location}</p>
            )}
            <span id="mensaje" className="error-mensaje pl-10 md:pl-0">{mensajeError}</span>
            <div id="map" className="lg:w-[900px] mapa-ajustar mt-5 propitario"></div>
        </div>
    );
};

export default MapaLeafletComponent;
