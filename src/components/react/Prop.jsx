import React, { useState, useEffect } from 'react';

const Prop = ({ url, caracteristicas }) => {
    const [propertyData, setPropertyData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (caracteristicas.length === 0) {
                    response = await fetch(url);
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

        fetchData();
    }, [url, caracteristicas]);

    if (!propertyData) {
        return 
    }

    return (
        <div>
            {propertyData && propertyData.length > 0 ? (
                <div>
                    <h2 className="font-bold text-[20px] ml-5 mt-5 mb-5 lg:ml-[95px]">Recomendados</h2>
                    <div className="lg:flex lg:flex-wrap m-auto lg:ml-20">
                        {propertyData.map((property, index) => (
                            <div className="propiedad ml-[30px] lg:ml-[1%] lg:w-[400px]" key={`prop_${property.id || index}_Premium`}>
                                <a href={property.propertyId}>
                                    {property.foto && <img src="public/casa1.jpg" alt="Property" className="w-[90%] h-[auto] rounded-[20px] lg:w-[100%]" />}
                                    <h2 className="lugar">{property.address}</h2>
                                    <h2 className="descripcion">{property.ownerName}</h2>
                                </a>
                            </div>
                        ))}
                    </div>

                    <h2 className="font-bold text-[20px] ml-5 mt-5 mb-5 lg:ml-[95px]">Mejor valorados</h2>
                    <div className="lg:flex lg:flex-wrap m-auto lg:ml-20">
                        {propertyData.map((property, index) => (
                            <div className="propiedad ml-[30px] lg:ml-[1%] lg:w-[400px]" key={`prop_${property.id || index}_NoPremium`}>
                                <a href={property.propertyId}>
                                    {property.foto && <img src="public/casa1.jpg" alt="Property" className="w-[90%] h-[auto] rounded-[20px] lg:w-[100%]" />}
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
