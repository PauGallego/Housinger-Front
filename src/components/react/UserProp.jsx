import React, { useEffect, useState } from 'react';
import './Styles/UserProp.css';
import Calendar from './Calendario.jsx';
import Resena from './Resena.jsx';
import Ubicacion from './Ubicacion.jsx';
import Normas from './Normas.jsx';
import Camas from './Camas.jsx'
import { API_BASE_URL } from '../../astro.config.js';
import { API_BASE_URL2 } from '../../astro.config.js';

import { Icon } from '@iconify/react';
import { Modal, Button } from '@mui/material'; 

const MyComponent = () => {
    const [id, setId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [propiedad, setPropiedad] = useState(null);
    const [imagenCentral, setImagenCentral] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [puedeGuardar, setPuedeGuardar] = useState(false); 
    const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);
    const [allCharacteristics, setAllCharacteristics] = useState([]);


    const handleCharacteristicChange = (event, characteristic) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedCharacteristics([...selectedCharacteristics, characteristic]);
        } else {
            setSelectedCharacteristics(selectedCharacteristics.filter((item) => item !== characteristic));
        }
    };
    


    useEffect(() => {
        const fetchCharacteristics = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/v1/characteristic/get/all`);
                if (!response.ok) {
                    throw new Error('Failed to fetch characteristics');
                }
                const data = await response.json();
                setAllCharacteristics(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCharacteristics();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const idParam = params.get('id');

                if (idParam) {
                    setId(idParam);
                    const response = await fetch(`${API_BASE_URL}/v1/property/get/${idParam}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch');
                    }
                    const data = await response.json();
                    setIsLoading(false);

                    if (data) {
                        setPropiedad(data);
                        console.log('data:', data);
                        // Verificar si el userId almacenado en localStorage coincide con el userId de la propiedad
                        const userIdLocalStorage = JSON.parse(localStorage.getItem('userData')).userId;
                        setPuedeGuardar(userIdLocalStorage === data.userId);
                    } else {
                        console.log('No se encontraron datos');
                    }
                } else {
                    console.log('No se encontró el parámetro "id"');
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleImageClick = (url) => {
        setImagenCentral(url);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openModal2 = () => {
        setShowModal2(true);
    };

    const closeModal2 = () => {
        setShowModal2(false);
    };

    const openModal3 = () => {
        setShowModal3(true);
    };

    const closeModal3 = () => {
        setShowModal3(false);
    };

    let arrayFotosSubidas = ["","","","","","","",""];

    const handleFileUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            arrayFotosSubidas[index] = file;
        } else {
            arrayFotosSubidas[index] = ""; 
        }
    }

    const guardarImagenes = async () => {
        const formData = new FormData();

    

        for (let i = 0; i < arrayFotosSubidas.length; i++) {
     
            if (!arrayFotosSubidas[i] && propiedad.fotos[i]) {
              
                const response = await fetch(`${API_BASE_URL}/v1/fileCustomer/download/${propiedad.fotos[i]}`);
                const blob = await response.blob();
                formData.append('files', blob, propiedad.fotos[i]);
            }
        }

        arrayFotosSubidas.forEach(async (file, index) => {
            if (file) {
                formData.append('files', file);
            } else {
                // Si el elemento en arrayFotosSubidas es una cadena vacía, agregar la imagen predeterminada "casa1.jpg" al FormData
                const response = await fetch(`${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`);
                const defaultImageBlob = await response.blob();
                formData.append('files', defaultImageBlob, 'casa1.jpg');
            }
        });
        
        
    
        try {
            const response = await fetch(`${API_BASE_URL}/v1/fileCustomer/uploadProperty/${propiedad.id}`, {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Failed to upload images');
            }
    
        

            const data = await response.json();

               
            propiedad.fotos = data;

            setPropiedad(propiedad);
            setImagenCentral(propiedad.fotos[0]);
    
            closeModal2();
        } catch (error) {
            // Manejar errores de red u otros errores
            console.error('Error uploading images:', error);
        }
    };
    
    
    
    
    
    
    
    

    const chatear = () => {
        window.location.href = `${API_BASE_URL2}/chat?receiver=${propiedad.customerId}`;
    }

    if (isLoading) {
        return <p>Cargando...</p>;
    }

    const defaultImage = "casa1.jpg";
    const fotosCompletas = propiedad.fotos.concat(Array.from({ length: 8 - propiedad.fotos.length }, (_, index) => defaultImage));

    return (
        <div>
            <main className="ml-2 md:ml-[110px] lg:ml-[270px] mr-2 md:mr-[100px] lg:mr-[270px]">
                {/* Dirección */}
                <div className="flex mt-5 lg:mt-10 gap- lg:ml-[245px] contendor-direcion items-center">
                    <i className="icon-[ion--location-sharp] icon-blue h-7 w-7"></i>
                    <p className='font-bold "'>{propiedad.address} </p>
                </div>

                <div>
                    {/* Imagenes */}
                    <div className="flex gap-5 justify-center items-center">
                        {/* Contenido de las imágenes izquierdas */}
                        <div className="hidden lg:flex justify-center items-center gap- flex-col">
                            {/* Mostrar las primeras tres imágenes */}
                            {fotosCompletas.slice(0, 2).map((foto, index) => (
                                <img
                                    key={index}
                                    className="prpiedad-foto-1 mt-10 rounded-[10px] h-[104px] w-[195px] md:h-[160px] lg:h-[130px]"
                                    src={`${API_BASE_URL}/v1/fileCustomer/download/${foto}`}
                                    alt={`imagen-propiedad-${index}`}
                                    onClick={() => handleImageClick(foto)}
                                    onMouseOver={() => handleImageClick(foto)}
                                />
                            ))}
                        </div>
                        {/* Imagen Central */}
                        <div className="flex justify-center items-center">
                            <img
                                className="mt-10 rounded-[10px] w-[195px] lg:h-[300px] lg:w-[450px]"
                                src={`${API_BASE_URL}/v1/fileCustomer/download/${imagenCentral || fotosCompletas[0]}`}
                                alt="imagen-propiedad-central"
                            />
                        </div>
                        {/* Contenido de las imágenes derechas */}
                        <div className="hidden lg:flex justify-center items-center gap- flex-col">
                            {/* Mostrar las siguientes tres imágenes */}
                            {fotosCompletas.slice(2, 4).map((foto, index) => (
                                <img
                                    key={index}
                                    className="prpiedad-foto-1 mt-10 rounded-[10px] h-[104px] w-[195px] md:h-[160px] lg:h-[130px]"
                                    src={`${API_BASE_URL}/v1/fileCustomer/download/${foto}`}
                                    alt={`imagen-propiedad-${index + 3}`}
                                    onClick={() => handleImageClick(foto)}
                                    onMouseOver={() => handleImageClick(foto)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Imagen PIE */}
                    <div className="flex justify-center items-center gap-[10px] lg:gap-[35px]">
                        {/* Mostrar las imágenes restantes */}
                        {fotosCompletas.slice(4).map((foto, index) => (
                            <img
                                key={index}
                                className="prpiedad-foto-1 mt-10 rounded-[10px] h-[104px] w-[195px] md:h-[160px] lg:h-[130px]"
                                src={`${API_BASE_URL}/v1/fileCustomer/download/${foto}`}
                                alt={`imagen-propiedad-${index + 6}`}
                                onClick={() => handleImageClick(foto)}
                                onMouseOver={() => handleImageClick(foto)}
                            />
                        ))}
                    </div>
                </div>

                {puedeGuardar && (
                    <div className="flex w-[100%] items-center justify-center mt-[50px]">
                        <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px]" onClick={openModal2}>Modificar Imagenes</button>
                    </div>
                )}

                {/* Modal */}
                <Modal open={showModal2} onClose={closeModal2} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div className="modal-box">
                        <h2>Subir imágenes nuevas</h2>
                        <div className="modal-content-container flex flex-wrap">
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className="file-input-container">
                                    <label htmlFor={`file-input-${index}`} className="file-label">Foto {index + 1}</label>
                                    <input
                                        type="file"
                                        id={`file-input-${index}`}
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, index)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                        <div className="modal-action mr-[20px]">
                        <button className="btn" onClick={guardarImagenes}>Guardar</button>
                        </div>
                        <div className="modal-action">
                           
                            <button className="btn" onClick={closeModal2}>Cerrar</button>
                        </div>
                        </div>
                       
                    </div>
                </Modal>



                {/* DESCRIPCION */}
                <div className="lg:ml-[240px] mt-10 contendor-descripcion">

                    {puedeGuardar && (
                        <textarea className='w-[80%]' defaultValue={propiedad.description}></textarea>
                    )}
                    {!puedeGuardar && (
                        <p>{propiedad.description}</p>
                    )}


                </div>

                {/* PROPIETARIO */}
                <div className="flex gap-[100px] md:gap-[50px] mb-10">
                    <div className="lg:flex lg:items-center lg:gap-10 md:flex md:items-center md:gap-10 mt-10">
                        <div className="flex items-center contenedor-propietario lg:ml-[240px] gap-5">
                            <div className="flex items-center gap-5">
                                <div>
                                    <h2 className="font-bold">Propietario</h2>
                                    <p>{propiedad.name} {propiedad.surname}</p>
                                </div>
                                <div>
                                    <img className="imagen-optima  w-[80px] rounded-[50%]" src={`${API_BASE_URL}/v1/fileCustomer/download/${propiedad.picture}`} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="rating flex items-center justify-center ">
                            <div className="rating">
                                <p className='mr-[10px] text-xl'>{propiedad.stars.toFixed(1)}</p>
                                {[...Array(5)].map((_, index) => (
                                    <input
                                        key={index}
                                        type="radio"
                                        name={`rating-${propiedad.star}`}
                                        className="mask mask-star-2 bg-yellow-500"
                                        checked={index < Math.round(propiedad.stars)}
                                        readOnly
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-[50px] lg:flex lg:items-center md:flex md:items-center gap-2">

                        {puedeGuardar && (
                            <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px]">Guardar</button>
                        )}
                        {!puedeGuardar && (
                            <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px]">Reservar</button>
                        )}
                        <br /><br />
                        <button id='chatear' className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px]" onClick={() => chatear()} >Chat</button>
                    </div>
                </div>
                {/* CARACTERISTICAS */}
                <h2 className="font-bold text-lg lg:ml-[235px] texto-que-hay">¿Qué hay en la vivienda?</h2>
                <div className="lg:flex lg:gap-20 md:gap-0">
                    <div className="flex items-center">

                        <div className="lg:ml-[235px] contendor-caracteritica mt-5">
                            {/* Mostrar las seis primeras características */}
                            <div className="flex  gap-7 flex-wrap mt-5 items-center  w-[250px]">
                                {propiedad.characteristics.slice(0, 6).map((caracteristica, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className='mr-[20px]'>
                                            <Icon icon={caracteristica.icon} className="h-[25px] w-[25px]" />
                                        </div>
                                        <div className='flex flex-col'>
                                            <label className="font-bold">{caracteristica.name}</label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Botón para abrir el modal */}
                                
                            {!puedeGuardar && (
                            <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px] mt-[20px]" onClick={openModal}>Mostrar más</button>
                            )}
                             {puedeGuardar && (
                            <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px] mt-[20px]" onClick={openModal3}>Modificar</button>
                            )}
                            
                            <Modal open={showModal} onClose={closeModal} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <div className="modal-box">
                                    <h2>Características</h2>
                                    <div className="modal-content-container flex flex-wrap">
                                        {Object.keys(propiedad.characteristics.reduce((groups, caracteristica) => {
                                            const { grupo, ...rest } = caracteristica;
                                            if (!groups[grupo]) groups[grupo] = [];
                                            groups[grupo].push(rest);
                                            return groups;
                                        }, {})).map((grupo, grupoIndex) => (
                                            <div key={grupoIndex} className="grupo-caracteristicas ">
                                                <h3 className="font-bold ">{grupo}</h3>
                                                <ul>
                                                    {propiedad.characteristics.reduce((acc, caracteristica) => {
                                                        if (caracteristica.grupo === grupo) {
                                                            acc.push(caracteristica);
                                                        }
                                                        return acc;
                                                    }, []).map((caracteristica, index) => (
                                                        <li key={index} className="caracteristica flex items-center">
                                                            <Icon icon={caracteristica.icon} className="h-[25px] w-[25px] mr-[10px]" />
                                                            <label className="font-bold">{caracteristica.name}</label>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="modal-action">
                                        <button className="btn" onClick={closeModal}>Cerrar</button>
                                    </div>
                                </div>
                            </Modal>
                            <Modal open={showModal3} onClose={closeModal3} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <div className="modal-box">
                                    <h2>Seleccionar características</h2>
                                    <div className="modal-content-container flex flex-wrap  w-[200px]">
                                        {Object.entries(allCharacteristics.reduce((groups, caracteristica) => {
                                            const { grupo, ...rest } = caracteristica;
                                            if (!groups[grupo]) groups[grupo] = [];
                                            groups[grupo].push(rest);
                                            return groups;
                                        }, {})).map(([grupo, caracteristicas], grupoIndex) => (
                                            <div key={grupoIndex} className="grupo-caracteristicas mt-[20px] ">
                                                <h3 className="font-bold ">{grupo}</h3>
                                                <ul>
                                                    {caracteristicas.map((caracteristica, index) => {
                                                        const isChecked = propiedad.characteristics.some(item => item.id === caracteristica.id);
                                                        return (
                                                            <li key={index} className="caracteristica flex items-center">
                                                                <Icon icon={caracteristica.icon} className="h-[25px] w-[25px] mr-[10px]" />
                                                                <input
                                                                    type="checkbox"
                                                                    id={`caracteristica-${caracteristica.id}`}
                                                                    defaultChecked={isChecked}
                                                                    onChange={(event) => handleCharacteristicChange(event, caracteristica)}
                                                                />
                                                                <label htmlFor={`caracteristica-${caracteristica.id}`} className="ml-2">{caracteristica.name}</label>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end">
                                    <div className="modal-action mr-[20px]">
                                    <button className="btn" onClick={closeModal3}>Modificar</button>
                                    </div>
                                    <div className="modal-action">
                                    
                                        <button className="btn" onClick={closeModal3}>Cerrar</button>
                                    </div>
                                    </div>
                                    
                                </div>
                            </Modal>
                        </div>

                        {/* BARRA VERTICAL */}
                        <div className="hidden lg:block bg-secondary h-[200px] w-[2px] lg:ml-[100px]"></div>
                        {/* CALENDARIO */}
                        <Calendar />
                    </div>
                    <div className="mt-10 lg:mt-5"></div>
                </div>
                {/* CAMAS */}
                <div className="lg:flex lg:gap-[200px] contneder-cama-premiun">
                    <Camas id={propiedad.id} guardar={puedeGuardar} ></Camas>
                    {/* PREMIUM */}
                    {propiedad.premium ? (
                        <div className="mt-10 lg:mt-[100px]">
                            <div className="flex flex-col items-center">
                                <p className="text-center font-bold	premiun-texto">HOUNSINGER</p>
                                <p className="text-center font-bold	premiun-texto">PREMIUM VERIFICADO</p>
                                <div className="h-10 w-10 bola-premiun flex items-center justify-center">
                                    <i className="icon-[mdi--crown] corono"></i>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-10 lg:mt-[100px]">
                            <p className="text-center font-bold	premiun-texto">NO PREMIUM VERIFICADO</p>
                        </div>
                    )}
                </div>
                {/* RESEÑAS */}
                <Resena id={propiedad.id} />
                {/* UBICACION */}
                <Ubicacion location={propiedad.address} userId={propiedad.userId} />
                {/* NORMAS, SEGURIDAD Y POLITICA */}
                <Normas normas={propiedad.normas} userId={propiedad.userId} seguridad={propiedad.seguridadHogar} />
                <div className="pb-[200px]"></div>
            </main>
        </div>
    );
};

export default MyComponent;
