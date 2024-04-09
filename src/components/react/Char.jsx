import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

const Char = ({ url }) => {
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
        <div className="flex justify-center lg:flex-wrap">

            {propertyData.map(char => (
                <button key={char.id} className="mt-5 ml-5 lg:ml-12 caracteristica w-30 h-20 m-5 flex flex-col	items-center">
                    <Icon icon={char.icon} id={char.id + "CharId"} className="h-9 w-9" />
                    <h2 className="nombreFiltro text-12 lg:text-15 md:text-16">
                        {char.name}
                    </h2>
                </button>
            ))}

            <div className='mt-5'>
                <button className="btn shadow border-2 border-gray-400 w-20" onClick={() => my_modal_4.showModal()}>
                    <i className="icon-[mage--filter] h-[25px] w-[25px] "></i>
                </button>
                <dialog id="my_modal_4" className="modal">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-lg">¿Que buscamos?</h3>
                        {propertyData.map(char => (
                            <button key={char.id} className="">
                                <Icon icon={char.icon} id={char.id + "CharId"} className="h-7 w-7" />
                                <h2 className="nombreFiltro text-12 lg:text-15 md:text-16">
                                    {char.name}
                                </h2>
                            </button>
                        ))}
                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn">Cerrar</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </div>
    );
};


/*
    <button className="filtro mt-8" onclick="my_modal_4.showModal()" style="border: none;">
                <i className="icon-[mage--filter] h-[25px] w-[25px] "></i>
            </button>
            <dialog id="my_modal_4" className="modal">
                <div className="modal-box" style="display: flex;">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h1 className="font-bold text-[20px] lg:ml-[45px]">¿Qué buscas?</h1>
                    {propertyData.map(char => (
                        <button key={char.id} className="mt-5 ml-5 lg:ml-12 caracteristica w-30 h-20 m-5">
                            {char.icon && <i className={char.icon + " w-30 h-30 lg:w-35 lg:h-35 md:w-40 md:h-40"} id={char.id + "CharId"} />}

                            <h2 className="nombreFiltro text-12 lg:text-15 md:text-16">
                                {char.name}
                            </h2>
                        </button>

                    ))}
                    <button type="submit" className="botonBuscar text-white px-4 py-2 rounded-md mt-5 lg:ml-[45px]">Buscar</button>
                </div>

            </dialog>
*/
export default Char;
