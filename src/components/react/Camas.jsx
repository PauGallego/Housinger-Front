import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

const CamasComponent = ({ id }) => {
    const [camas, setCamas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8081/v1/bed/getByProperty/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCamas(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div className="contendor-camas mt-10 lg:ml-[230px]  ">
            <h2 className="font-bold text-lg texto-que-hay">¿Dónde dormimos?</h2>
            {camas.map(cama => (
                <div key={cama.id} className="flex items-center justify-center gap-5">
                    <div className="mt-5 flex items-center justify-center gap-2">
                        <Icon icon={cama.icon} className="h-[25px] w-[25px] mr-[10px]" />
                        <label className="mt-2">{`${cama.number} ${cama.type}`}</label>
                    </div>
                </div>
            ))}
            <div className='hidden'>
                <button className="boton-anadir-cama mt-5 w-7 h-7">+</button>
                <label>Añadir cama</label>
            </div>
        </div>
    );
};

export default CamasComponent;
