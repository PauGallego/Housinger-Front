import React, { useState, useEffect } from 'react';

const Prop = ({ url }) => {
    const [propertyData, setPropertyData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                setPropertyData(data);
            } catch (error) {
                console.error('Error fetching property data:', error);
            }
        };

        fetchData();
    }, [url]);

    if (!propertyData) {
        return <div>Loading...</div>;
    }

    let premium = propertyData.filter(property => property.premium === true);
    let nopremium = propertyData.filter(property => property.premium === false);

    if (premium.length > 0) {
        return (
            <div>
                <h2 className="font-bold text-[20px] ml-5 mt-5 mb-5 lg:ml-[95px]">Recomendados</h2>
    
                <div className="lg:flex lg:flex-wrap m-auto lg:ml-20">
                    {premium.map(property => (
                        <div className="propiedad ml-[30px] lg:ml-[1%] lg:w-[400px]" key={property.id + "PropId1"}>
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
                    {nopremium.map(property => (
                        <div className="propiedad ml-[30px] lg:ml-[1%] lg:w-[400px]" key={property.id + "PropId2"}>
                            <a href={property.propertyId}>
                                {property.foto && <img src="public/casa1.jpg" alt="Property" className="w-[90%] h-[auto] rounded-[20px] lg:w-[100%]" />}
                                <h2 className="lugar">{property.address}</h2>
                                <h2 className="descripcion">{property.ownerName}</h2>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <h2 className="font-bold text-[20px] ml-5 mt-5 mb-5 lg:ml-[95px]">Mejor valorados</h2>
    
                <div className="lg:flex lg:flex-wrap m-auto lg:ml-20">
                    {propertyData.map(property => (
                        <div className="propiedad ml-[30px] lg:ml-[1%] lg:w-[400px]" key={property.id + "PropId3"}>
                            <a href={property.propertyId}>
                                {property.foto && <img src="public/casa1.jpg" alt="Property" className="w-[90%] h-[auto] rounded-[20px] lg:w-[100%]" />}
                                <h2 className="lugar">{property.address}</h2>
                                <h2 className="descripcion">{property.ownerName}</h2>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
};

export default Prop;
