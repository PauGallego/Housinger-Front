import React, { useState, useEffect } from 'react';

const Prop = ({ url, caracteristicas }) => {
    const [propertyData, setPropertyData] = useState(null);

    useEffect(() => {
        

        if (caracteristicas.length == 0) {
            const fetchData = async () => {
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    setPropertyData(data);

                    console.log(url);
                } catch (error) {
                    console.error('Error fetching property data:', error);
                }
            };

            fetchData();
        } else {
            
                    
            const fetchData = async () => {
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            characteristics: caracteristicas.map(item => item.id)
                        })
                    });
                    const data = await response.json();
                    setPropertyData(data);
                } catch (error) {
                    console.error('Error fetching property data:', error);
                }
            };
    
            fetchData();
        }
    }, [url, caracteristicas]);
    if (!propertyData) {
        return <div></div>;
    }

    return (
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
    );
};

export default Prop;
