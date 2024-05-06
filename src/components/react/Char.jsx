import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import '../../global.css';
//URL GLOABAL AÑADIR SIEMPRE
import { API_BASE_URL } from '../../astro.config.js';
import Prop from './Prop.jsx';

const Char = ({ url }) => {
    const [propertyData, setPropertyData] = useState(null);
    const [urlTemp, setUrlTemp] = useState(null);
    const [numIcons, setNumIcons] = useState(12);
    const [activeButtons, setActiveButtons] = useState(new Set());
    const [selectedItems, setSelectedItems] = useState([]);
    const [refresh, setRefresh] = useState(false); 


    let urlParams = new URLSearchParams(window.location.search);
    let startDatev = urlParams.get('startDate');
    let endDatev = urlParams.get('endDate');
    let locationv = urlParams.get('destination');

    let urlbase= `${API_BASE_URL}/v1/propertyCharacteristics/get/all`;
    let url1 = `${API_BASE_URL}/v1/propertyCharacteristics/get`;
    let url2 = `${API_BASE_URL}/v1/propertyCalendar/get`;
    let url3 = `${API_BASE_URL}/v1/propertyLocation/get`;

    useEffect(() => {
    
        setUrlTemp(`${API_BASE_URL}/v1/propertyCharacteristics/get/all`);
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
            <div className="loading-container ">
                <img src="../../cargar.gif" alt="Cargando..." />
            </div>
        );
    }

    const limitedData = propertyData.slice(0, numIcons);

    const handleButtonClick = (index, id) => {

        const newActiveButtons = new Set(activeButtons);
        let updatedSelectedItems = [...selectedItems];
    
        if (newActiveButtons.has(index)) {
            newActiveButtons.delete(index);
            updatedSelectedItems = selectedItems.filter(item => item.id !== id);
        } else {
            newActiveButtons.add(index);
            updatedSelectedItems.push({ id, name: propertyData[index].name });
        }
    
        setActiveButtons(newActiveButtons);
        setSelectedItems(updatedSelectedItems);
        
        if (updatedSelectedItems.length == 0) {
            setUrlTemp(`${API_BASE_URL}/v1/propertyCharacteristics/get/all`);
        } else {
            setUrlTemp(`${API_BASE_URL}/v1/propertyCharacteristics/get`);
        }
    };
    
    return (
        <div>
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

            <div className='mt-5'>
                <button className="btn-[#ffff] shadow border-2 border-gray-400 w-20 rounded-[20px] mt-2" onClick={() => document.getElementById('my_modal_4').showModal()}>
                    <i className="icon-[mage--filter] h-[25px] w-[25px] mt-1 "></i>
                </button>
                <dialog id="my_modal_4" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-[20px] mb-10">¿Qué buscamos?</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {propertyData.filter(char => char.grupo === "Ubicacion").slice(0, 16).map((char, index) => (
                            <button
                                key={char.id}
                                className={`flex items-center ${activeButtons.has(index) ? 'boton-filtro2' : 'boton-filtro3'}`}
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
                        <button className="btn cerrar" onClick={() => document.getElementById('my_modal_4').close()}>Cerrar</button>
                    </div>
                </div>
            </dialog>
            </div>
        </div>

        <Prop urlbase={urlbase} url={url1} url2={url2} url3={url3} caracteristicas={selectedItems} startDate={startDatev} endDate={endDatev} location={locationv} client:only="svelte" />

        </div>
    );
};

export default Char;