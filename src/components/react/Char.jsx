import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import '../../global.css';

const Char = ({ url }) => {
    const [propertyData, setPropertyData] = useState(null);
    const [numIcons, setNumIcons] = useState(12);
    const [activeButtons, setActiveButtons] = useState(new Set());
    const [selectedItems, setSelectedItems] = useState([]);

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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 790) {
                setNumIcons(3);
            } else if (window.innerWidth < 1708) {
                setNumIcons(6);
            } else {
                setNumIcons(12);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (!propertyData) {
        return (
            <div className="loading-container">
                <img src="../../cargar.gif" alt="Cargando..." />
            </div>
        );
    }
    
    const limitedData = propertyData.slice(0, numIcons);

    // CAMBIA EL COLOR DEL BOTON AL HACER CLICK Y GUARDA EL ELEMENTO SELECCIONADO
    const handleButtonClick = (index, id) => {
        const newActiveButtons = new Set(activeButtons);
        if (newActiveButtons.has(index)) {
            newActiveButtons.delete(index);
            setSelectedItems(selectedItems.filter(item => item.id !== id));
        } else {
            newActiveButtons.add(index);
            setSelectedItems([...selectedItems, { id, name: propertyData[index].name }]);
        }
        setActiveButtons(newActiveButtons);
    };

    return (
        <div className="flex justify-center lg:flex-wrap">
            {limitedData.map((char, index) => (
                <button
                    key={char.id}
                    className={`mt-5 ml-5 lg:ml-5 caracteristica AAA m-5 flex flex-col items-center ${index >= numIcons - 1 ? 'hide-on-mobile' : ''} ${activeButtons.has(index) ? 'boton-filtro' : ''}`}
                    onClick={() => handleButtonClick(index, char.id)}
                    style={{ backgroundColor: activeButtons.has(index) ? '#576cbc' : '#ffffff' }}
                >
                    <Icon icon={char.icon} id={char.id + "CharId"} className="h-9 w-9" />
                    <h2 className={`nombreFiltro text-12 lg:text-15 md:text-16 ${activeButtons.has(index) ? 'nombreFiltro-activo' : ''}`}>
                        {char.name}
                    </h2>
                </button>
            ))}

            {/* MODAL DE LOS FILTROS */}
            <div className='mt-5'>
                <button className="btn-[#ffff] shadow border-2 border-gray-400 w-20 rounded-[20px] mt-2" onClick={() => my_modal_4.showModal()}>
                    <i className="icon-[mage--filter] h-[25px] w-[25px] mt-1 "></i>
                </button>
                <dialog id="my_modal_4" className="modal">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-[20px] mb-10">¿Qué buscamos?</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {propertyData.map((char, index) => (
                                <button
                                    key={char.id}
                                    className={`flex items-center ${activeButtons.has(index) ? 'boton-filtro2' : ''}`}
                                    onClick={() => handleButtonClick(index, char.id)}
                                    style={{ backgroundColor: activeButtons.has(index) ? '#576cbc' : '#ffffff' }}
                                >
                                    <Icon icon={char.icon} id={char.id + "CharId"} className="h-10 w-10" />
                                    <h2 className={`nombreFiltro text-12 lg:text-15 md:text-16 ${activeButtons.has(index) ? 'nombreFiltro-activo' : ''}`}>
                                        {char.name}
                                    </h2>
                                </button>
                            ))}
                        </div>
                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn">Cerrar</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>

            {/* ARRAY LIST, MUESTRA LAS SELCIONADAS "selectedItems" ES EL ARRAY*/}
            <div>
                <ul>
                    {/* MUESTRA DE QUE VA EL ARRAY*/}
                    {/* {selectedItems.map(item => (
                        <li key={item.id}>{item.name}</li>
                    ))} */}
                </ul>
            </div>
        </div>
    );
};

export default Char;
