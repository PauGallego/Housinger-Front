import React, { useState, useEffect } from 'react';
import { API_BASE_URL2 } from '../../astro.config';
import { API_BASE_URL } from '../../astro.config';

const Prop = ({ urlbase, url, url2, url3, caracteristicas, startDate, endDate, location }) => {
    const [propertyData, setPropertyData] = useState(null);
    const [propertyData2, setPropertyData2] = useState(null);
    const [propertyData3, setPropertyData3] = useState(null);

    if (startDate == null) {
        startDate = "";
    }
    if (endDate == null) {
        endDate = "";
    }

    if (location == null) {
        location = "";
    }

    useEffect(() => {

        setPropertyData(null);

        const fetchData = async () => {
            try {
                let response;
                if (caracteristicas.length == 0) {
                    response = await fetch(urlbase);
                } else {
                    response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            characteristics: caracteristicas.map(item => item.id)
                        })
                    });
                }
                const data = await response.json();
                setPropertyData(data);
            } catch (error) {
                console.error('Error fetching property data:', error);
            }
        };

        const fetchData2 = async () => {
            try {
                let response;
                if (startDate.length == 0 || endDate.length == 0) {
                    response = await fetch(urlbase);
                } else {
                    response = await fetch(url2, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            startDate: startDate,
                            endDate: endDate,
                        })
                    });
                }
                const data = await response.json();
                setPropertyData2(data);
            } catch (error) {
                console.error('Error fetching property data:', error);
            }
        }

        const fetchData3 = async () => {
            try {
                let response;
                if (location.length == 0) {
                    response = await fetch(urlbase);
                } else {
                    response = await fetch(url3, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            location: location
                        })
                    });
                }
                const data = await response.json();
                setPropertyData3(data);
            } catch (error) {
                console.error('Error fetching property data:', error);
            }
        }

        fetchData();
        fetchData2();
        fetchData3();

    }, [urlbase, url, url2, url3, caracteristicas, startDate, endDate, location]);

    let propiedadesFiltradas = [];

    if (propertyData != null && propertyData2 != null && propertyData3 != null && propertyData.length > 0 && propertyData2.length > 0 && propertyData3.length > 0) {

        propiedadesFiltradas = propertyData.filter(value =>
            propertyData2.some(obj => JSON.stringify(obj) === JSON.stringify(value)) &&
            propertyData3.some(obj => JSON.stringify(obj) === JSON.stringify(value))
        );

        console.log(propiedadesFiltradas);

    }

    if (!propertyData || !propertyData2 || !propertyData3) {
        return (
            <div className="loading-container ">
                <img src="../../cargar.gif" alt="Cargando..." />
            </div>
        );
    }

    return (
        <div>
            {propiedadesFiltradas && propiedadesFiltradas.length > 0 ? (
                <div>
                    {propiedadesFiltradas.some(property => property.premium === true) && (
                        <>
                            <h2 className="font-bold text-[20px] ml-5 mt-5 mb-5 lg:ml-[95px]">Recomendados</h2>
                            <div className="lg:flex lg:flex-wrap m-auto lg:ml-20">
                                {propiedadesFiltradas.filter(property => property.premium === true).map((property, index) => (
                                    <div className="propiedad ml-[30px] lg:ml-[1%] lg:w-[400px]" key={`prop_${property.id || index}_Premium`}>
                                        <a href={`${API_BASE_URL2}/user_prop?id=${property.propertyId}`}>
                                            {property.foto ? (
                                                <img src={`${API_BASE_URL}/v1/fileCustomer/download/${property.foto}`} alt="Property" className="w-[90%] h-[250px] rounded-[20px] lg:w-[100%]" />
                                            ) : (
                                                <img src={`${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`} alt="Property" className="w-[90%] h-[250px] rounded-[20px] lg:w-[100%]" />
                                            )}
                                            <h2 className="lugar">{property.address}</h2>
                                            <h2 className="descripcion">{property.ownerName}</h2>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
    
                    <h2 className="font-bold text-[20px] ml-5 mt-5 mb-5 lg:ml-[95px]">Mejor valorados</h2>
                    <div className="lg:flex lg:flex-wrap m-auto lg:ml-20">
                        {propiedadesFiltradas.map((property, index) => (
                            <div className="propiedad ml-[30px] lg:ml-[1%] lg:w-[400px]" key={`prop_${property.id || index}_NoPremium`}>
                                <a href={`${API_BASE_URL2}/user_prop?id=${property.propertyId}`}>
                                    {property.foto ? (
                                        <img src={`${API_BASE_URL}/v1/fileCustomer/download/${property.foto}`} alt="Property" className="w-[90%] h-[250px] rounded-[20px] lg:w-[100%]" />
                                    ) : (
                                        <img src={`${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`} alt="Property" className="w-[90%] h-[250px] rounded-[20px] lg:w-[100%]" />
                                    )}
                                    <h2 className="lugar">{property.address}</h2>
                                    <h2 className="descripcion">{property.ownerName}</h2>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex justify-center mt-20 items-center flex-col">
                    <p className='lg:text-xl md:text-lg'>No hay propiedades con estas características.</p>
                    <img className="h-[150px] w-[150px] lg:h-[280px] lg:w-[280px] md:h-[250px] md:w-[250px]" src="../../buscar.jpg" alt="Cargando..." />
                </div>
            )}
        </div>
    );

};

export default Prop;
