import React, { useState, useEffect } from 'react';

const Prop = ({ url }) => {
    const [propertyData, setPropertyData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                setPropertyData(data);
                console.log('Property data:', data);
            } catch (error) {
                console.error('Error fetching property data:', error);
            }
        };

        fetchData();
    }, [url]);

    if (!propertyData) {
        return <div>Loading...</div>;
    }

    return (
        <div class="lg:flex lg:flex-wrap m-auto lg:ml-20">
        
            {propertyData.map(property => (
                <div className="propiedad ml-[30px] lg:ml-[1%] lg:w-[400px]">
                <a key={property.id} href={property.propertyId}>
                    {property.foto && <img src="public/casa1.jpg" alt="Property" className="w-[90%] h-[auto] rounded-[20px] lg:w-[100%]" />}
                    <h2 className="lugar">
                        {property.address}
                    </h2>
                    <h2 className="descripcion">
                        {property.ownerName}
                    </h2>
                </a>
                </div>
            ))}
      
        </div>
    );
};

export default Prop;
