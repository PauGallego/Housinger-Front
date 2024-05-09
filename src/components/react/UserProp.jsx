import React, { useEffect, useState } from 'react';
import './Styles/UserProp.css';
import Calendar from './Calendario.jsx';
import Resena from './Resena.jsx';
import Ubicacion from './Ubicacion.jsx';
import Normas from './Normas.jsx';
import { API_BASE_URL } from '../../astro.config.js';


const MyComponent = () => {

    const [id, setid] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [propiedad, setPropiedad] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const idParam = params.get('id');
    
                if (idParam) {
                    setid(idParam);
                    const response = await fetch(`${API_BASE_URL}/v1/property/get/${idParam}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch');
                    }
                    const data = await response.json();
                    setIsLoading(false);
    
                    if (data) {
                        setPropiedad(data);
                        console.log('data:', data);
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
    





    if (isLoading) {
        return <p>Cargando...</p>;
    }


    const defaultImage = "casa1.jpg";
    const fotosCompletas = propiedad.fotos.concat(Array.from({ length: 8 - propiedad.fotos.length }, (_, index) => defaultImage));

    return (
        <div>
            <main className="ml-2 md:ml-[110px] lg:ml-[270px] mr-2 md:mr-[100px] lg:mr-[270px]">
                {/* Dirección */}
                <div className="flex mt-5 lg:mt-10 gap- lg:ml-[245px] contendor-direcion">
                    <i className="icon-[ion--location-sharp] icon-blue h-7 w-7"></i>
                    <p className='font-bold "'>{propiedad.address} </p>
              
                </div>
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
                            />
                        ))}
                    </div>
                    {/* Imagen Central */}
                    <div className="flex justify-center items-center">
                        <img 
                            className="mt-10 rounded-[10px] w-[195px] lg:h-[300px] lg:w-[450px]" 
                            src={`${API_BASE_URL}/v1/fileCustomer/download/${fotosCompletas[0]}`} 
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
                        />
                    ))}
                </div>


                {/* DESCRIPCION */}
                <div className="lg:ml-[240px] mt-10 contendor-descripcion">
                    <p>{propiedad.description}</p>
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
                                    <img className="imagen-optima h-[90px] w-[100px] rounded-[50%]" src={`${API_BASE_URL}/v1/fileCustomer/download/${propiedad.picture}`} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="rating">
                            <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500" />
                            <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500"  />
                            <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500" />
                            <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500" />
                            <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500" />
                        </div>
                    </div>
                    <div className="mt-[50px] lg:flex lg:items-center md:flex md:items-center gap-2">
                        <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px]">¡Reservar!</button>
                        <br /><br />
                        <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px]">Chat</button>
                    </div>
                </div>
                {/* CARACTERISTICAS */}
                <h2 className="font-bold text-lg lg:ml-[235px] texto-que-hay">¿Qué hay en la vivienda?</h2>
                <div className="lg:flex lg:gap-20 md:gap-0">
                    <div className="flex items-center">
                        <div className="lg:ml-[235px] contendor-caracteritica mt-5">
                            <div className="flex gap-10">
                                <div>
                                    <input type="checkbox" className="h-[20px] w-[20px]" />
                                    <i className="icon-[material-symbols--wifi] h-[25px] w-[25px]"></i>
                                    <label className="font-bold">Wifi</label>
                                </div>
                                <div>
                                    <input type="checkbox" className="h-[20px] w-[20px]" />
                                    <i className="icon-[material-symbols--wifi] h-[25px] w-[25px]"></i>
                                    <label className="font-bold">Wifi</label>
                                </div>
                            </div>
                            <div className="flex gap-10 mt-5">
                                <div>
                                    <input type="checkbox" className="h-[20px] w-[20px]" />
                                    <i className="icon-[material-symbols--wifi] h-[25px] w-[25px]"></i>
                                    <label className="font-bold">Wifi</label>
                                </div>
                                <div>
                                    <input type="checkbox" className="h-[20px] w-[20px]" />
                                    <i className="icon-[material-symbols--wifi] h-[25px] w-[25px]"></i>
                                    <label className="font-bold">Wifi</label>
                                </div>
                            </div>
                            <div className="flex gap-10 mt-5">
                                <div>
                                    <input type="checkbox" className="h-[20px] w-[20px]" />
                                    <i className="icon-[material-symbols--wifi] h-[25px] w-[25px]"></i>
                                    <label className="font-bold">Wifi</label>
                                </div>
                                <div>
                                    <input type="checkbox" className="h-[20px] w-[20px]" />
                                    <i className="icon-[material-symbols--wifi] h-[25px] w-[25px]"></i>
                                    <label className="font-bold">Wifi</label>
                                </div>
                            </div>
                            <button className="mt-10 boton-modal lg:w-40">Mostrar más</button>
                        </div>
                        {/* BARRA VERTICAL */}
                        <div className="hidden lg:block bg-secondary h-[200px] w-[2px] lg:ml-[100px]"></div>
                        {/* CALENDARIO */}
                        <Calendar />
                    </div>
                    <div className="mt-10 lg:mt-5">

                    </div>
                </div>
                {/* CAMAS */}
                <div className="lg:flex lg:gap-[200px] contneder-cama-premiun">
                    <div className="contendor-camas mt-10 lg:ml-[230px]">
                        <h2 className="font-bold text-lg texto-que-hay">¿Dónde dormimos?</h2>
                        <div className="flex gap-5">
                            <div className="mt-5 flex gap-2">
                                <i className="icon-[material-symbols--bed-outline] h-[30px] w-[30px]"></i>
                                <label className="mt-2">1 cama doble</label>
                            </div>
                            <div className="mt-5 flex gap-2">
                                <i className="icon-[material-symbols--bed-outline] h-[30px] w-[30px]"></i>
                                <label className="mt-2">1 cama doble</label>
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div className="mt-5 flex gap-2">
                                <i className="icon-[material-symbols--bed-outline] h-[30px] w-[30px]"></i>
                                <label className="mt-2">1 cama doble</label>
                            </div>
                            <div className="mt-5 flex gap-2">
                                <i className="icon-[material-symbols--bed-outline] h-[30px] w-[30px]"></i>
                                <label className="mt-2">1 cama doble</label>
                            </div>
                        </div>
                        <div>
                            <button className="boton-anadir-cama mt-5 w-7 h-7">+</button>
                            <label>Añadir cama</label>
                        </div>
                    </div>
                    {/* PREMIUM */}
                    <div className="mt-10 lg:mt-[100px]">
                        <div className="flex flex-col items-center">
                            <p className="text-center font-bold	premiun-texto">HOUNSINGER</p>
                            <p className="text-center font-bold	premiun-texto">PREMIUM VERIFICADO</p>
                            <div className="h-10 w-10 bola-premiun flex items-center justify-center">
                                <i className="icon-[mdi--crown] corono"></i>
                            </div>
                        </div>
                    </div>
                </div>
                {/* RESEÑAS */}
                <Resena />

                {/* UBICACION */}

                <Ubicacion  location={propiedad.address} />

                {/* NORMAS, SEGURIDAD Y POLITICA */}
                <Normas />

                <div className="mb-[100px]"></div>
            </main>
        </div>
    );
};

export default MyComponent;
