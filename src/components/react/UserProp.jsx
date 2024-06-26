import React, { useEffect, useState } from 'react';
import './Styles/UserProp.css';
import Calendar from './Calendario.jsx';
import Calendar2 from './CalendarioSelec.jsx'
import Calendar3 from './CalendarioSelec2.jsx'
import Resena from './Resena.jsx';
import Ubicacion from './Ubicacion.jsx';
import Normas from './Normas.jsx';
import Camas from './Camas.jsx'
import { API_BASE_URL } from '../../astro.config.js';
import { API_BASE_URL2 } from '../../astro.config.js';

import { Icon } from '@iconify/react';
import { Modal, Box, Button, TextField, Rating } from '@mui/material';
import { set } from 'date-fns';
import { ca, fi } from 'date-fns/locale';


const MyComponent = () => {
    const [id, setId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [propiedad, setPropiedad] = useState(null);
    const [imagenCentral, setImagenCentral] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal4, setShowModal4] = useState(false);
    const [showModal5, setShowModal5] = useState(false);
    const [showModal6, setShowModal6] = useState(false);
    const [puedeGuardar, setPuedeGuardar] = useState(false); 
    const [allCharacteristics, setAllCharacteristics] = useState([]);
    const [modifiedCharacteristics, setModifiedCharacteristics] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
                        
                        let userIdLocalStorage;
                        try{
                            userIdLocalStorage = JSON.parse(localStorage.getItem('userData')).userId;
                        }catch{
                         userIdLocalStorage = null;
                        }


                        setPuedeGuardar(userIdLocalStorage === data.userId);

                        const isAdmin = await fetch(`${API_BASE_URL}/v1/user/admin/${userIdLocalStorage}`);

                        if (isAdmin.ok) {
                            setPuedeGuardar(true);
                            localStorage.setItem("admin", true);
                        }
           

                        if (data.characteristics.length > 0 && modifiedCharacteristics.length === 0) {
                            // Copia independiente de las características existentes
                            const copiedCharacteristics = [...data.characteristics];
                            setModifiedCharacteristics(copiedCharacteristics);
                        }

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

    const openModal4 = () => {
        setShowModal4(true);
    };

    const closeModal4 = () => {
        setShowModal4(false);
    };

    const openModal5 = () => {
        localStorage.removeItem("first_date");
        localStorage.removeItem("last_date");
        setShowModal5(true);
    };

    const closeModal5 = () => {
        setShowModal5(false);
    };

    const openModal6 = () => {
        setShowModal6(true);
    };

    const closeModal6 = () => {
        setShowModal6(false);
    };

    const nextModal  = () => {
        let day = localStorage.getItem("first_date");
        let error2 = document.getElementById("errorDiaEntrada");
    
        if (!day) {
            error2.innerHTML = "¡Debes seleccionar una fecha!";
            return;
        }
    
        setShowModal5(false);
        setShowModal6(true);
    };
    

    const prevModal  = () => {
        localStorage.removeItem("first_date");
        localStorage.removeItem("last_date");
        setShowModal6(false);
        setShowModal5(true);
       
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
        setIsButtonDisabled(true);
        const formData = new FormData();
    
        for (let i = 0; i < arrayFotosSubidas.length; i++) {
            const file = arrayFotosSubidas[i];
            
            if (file) {
         
                formData.append('files', file);
            } else if (propiedad.fotos[i]) {
           
                const response = await fetch(`${API_BASE_URL}/v1/fileCustomer/download/${propiedad.fotos[i]}`);
                const blob = await response.blob();
                formData.append('files', blob, propiedad.fotos[i]);
            } else {
       
                const response = await fetch(`${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`);
                const defaultImageBlob = await response.blob();
                formData.append('files', defaultImageBlob, 'casa1.jpg');
            }
        }
    
        const modalSuccess = document.getElementById('my_modal_15');

        try {
            // Muestra el modal antes de hacer la solicitud
            modalSuccess.showModal();
            
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
        } catch (error) {
      
            console.error('Error uploading images:', error);
        } finally {
  
            modalSuccess.close();
            closeModal2();
        }
        
        setIsButtonDisabled(false);
    };
    const chatear = () => {

        const userIdLocalStorage = localStorage.getItem('userData');

        if(userIdLocalStorage){
            window.location.href = `${API_BASE_URL2}/chat?receiver=${propiedad.customerId}`;
        }else{
            window.location.href = `${API_BASE_URL2}/login`;
        }
        
    }

    const reservar = () => {

        const userIdLocalStorage = localStorage.getItem('userData');

        if(userIdLocalStorage){
           openModal5();
        }else{
            window.location.href = `${API_BASE_URL2}/login`;
        }
        
    }

    const reservarTrue = async () => {
        let last_date = localStorage.getItem("last_date");
        let error2 = document.getElementById("errorDiaSalida");
            
        if (!last_date) {
            error2.innerHTML = "¡Debes seleccionar una fecha!";
            return;
        }
    
        try {

            let userId = null;
            let first_date = null;
            let last_date = null;

            try{
                 userId = JSON.parse(localStorage.getItem('userData')).userId;
            }catch{
                 userId = null;
            }   

            try{
                 first_date = localStorage.getItem("first_date");
            }catch{
                 first_date = null;
            }

            try{
                 last_date = localStorage.getItem("last_date");
            }catch{
                 last_date = null;
            }


            const reservationData = {
                reservationUserId: userId,
                reservationPropertyId: propiedad.id, 
                dateStart:  new Date (first_date), 
                dateEnd:  new Date (last_date)
            };

            console.log(JSON.stringify(reservationData));
    
            const response = await fetch(`${API_BASE_URL}/v1/reservation/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Authentication ' + localStorage.getItem('authorization')
                },
                body: JSON.stringify(reservationData)
            });
    
            if (response.ok) {
                console.log('Reserva realizada con éxito.');
                window.location.href = `${API_BASE_URL2}/chat?receiver=${propiedad.customerId}`;
            } else {
           
                console.error('Error al realizar la reserva:', response.statusText);
            }
        } catch(error) {
           
            console.error('Error:', error);
        }
    }
    



    if (isLoading) {
        return <div className="h-[100vh] loading-container flex justify-center items-start mt-[5px]"><img src="../../cargar.gif" alt="Cargando..." /></div>;
    }

    const defaultImage = "casa1.jpg";
    const fotosCompletas = propiedad.fotos.concat(Array.from({ length: 8 - propiedad.fotos.length }, (_, index) => defaultImage));

    const handleCharacteristicChange = (event, caracteristica) => {
        const { id, name, icon } = caracteristica;
        const isChecked = event.target.checked;
    
        if (isChecked) {
            setModifiedCharacteristics(prevState => {
                return [...prevState, { id, name, icon, grupo: caracteristica.grupo, checked: true }];
            });
        } else {
            setModifiedCharacteristics(prevState => {
                return prevState.filter(item => item.id !== id);
            });
        }
    };

    const saveChanges = () => {
        const existingCharacteristics = [...propiedad.characteristics];
  
    
        const newCharacteristics = modifiedCharacteristics.filter(modifiedCharacteristic =>
            modifiedCharacteristic.checked && !existingCharacteristics.some(existingCharacteristic => existingCharacteristic.id === modifiedCharacteristic.id)
        );

    
        const updatedModifiedCharacteristics = modifiedCharacteristics.map(modifiedCharacteristic => ({
            ...modifiedCharacteristic,
            checked: modifiedCharacteristic.checked || existingCharacteristics.some(existingCharacteristic => existingCharacteristic.id === modifiedCharacteristic.id)
        }));
        
    
    
        const atLeastOneChecked = updatedModifiedCharacteristics.some(modifiedCharacteristic =>
            existingCharacteristics.some(existingCharacteristic => existingCharacteristic.id === modifiedCharacteristic.id && modifiedCharacteristic.checked)
        );
    
        const finalCharacteristics = existingCharacteristics.filter(existingCharacteristic =>
            updatedModifiedCharacteristics.some(modifiedCharacteristic => modifiedCharacteristic.id === existingCharacteristic.id)
        );
  
    
        const updatedCharacteristics = [...finalCharacteristics, ...newCharacteristics];
    
        propiedad.characteristics = updatedCharacteristics;
        console.log("Propiedad actualizada:", propiedad);
        setPropiedad(propiedad);
        closeModal3();
    };


    


    const updateProperty = async () => {
        try {
            console.log("Updating property...");
    
            propiedad.address = localStorage.getItem("ubi");
            propiedad.description = document.getElementById("descripcione").value;
    
            let seguridadHogar = null;

            try{
                 seguridadHogar = JSON.parse(localStorage.getItem("seguridad"));
            }catch{
                 seguridadHogar = null;
            }


            propiedad.seguridadHogar = seguridadHogar && seguridadHogar.length ? seguridadHogar : null;
    
           let normas;

            try{
                 normas = JSON.parse(localStorage.getItem("normas"));
            }catch{
                 normas = null;
            }


            propiedad.normas = normas && normas.length ? normas : null;
    
            let token = localStorage.getItem('authorization');
    
            // Delete existing beds associated with the property
            await fetch(`${API_BASE_URL}/v1/bed/deletebyProperty/${propiedad.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Authentication ' + token,
                }
            });
    
            let test = false;
            let test2 = false;
            // Save updated beds
           
            let camas;


            try{
                 camas = JSON.parse(localStorage.getItem("camasModificadas"));
            }catch{
                 camas = null;
            }

            await Promise.all(camas.map(async (element) => {
                let bedJSOn = {
                    bedTypeId: element[0],
                    number: element[1],
                    propertyId: propiedad.id
                };
                let token = localStorage.getItem('authorization');
                let response = await fetch(`${API_BASE_URL}/v1/bed/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Authentication ' + token,
                    },
                    body: JSON.stringify(bedJSOn)
                });
    
                if (!response.ok) {
                    throw new Error('Error al actualizar las camas');
                } else {
                    test = true;
                }
    
                console.log('Bed updated successfully');
            }));
    
            let propiedadJSON = {
                address: propiedad.address,
                calendar: propiedad.calendar,
                characteristics: propiedad.characteristics,
                description: propiedad.description,
                extraInfo: "string",
                fotos: propiedad.fotos,
                id: propiedad.id,
                normas: propiedad.normas,
                userId: propiedad.userId,
                seguridadHogar: propiedad.seguridadHogar
            };
    
            console.log(JSON.stringify(propiedadJSON));
            
    
            fetch(`${API_BASE_URL}/v1/property/save`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Authentication ' + token,
                    },
                    body: JSON.stringify(propiedadJSON)
                })
                .then(response => {
                    if (!response.ok) {
                        console.log(response);
                        if (response.status === 500) {
                            const modal = document.getElementById('my_modal_20');
                            modal.showModal();
    
                            const closeButton = modal.querySelector('button');
                            closeButton.addEventListener('click', () => {
                                modal.close();
                            });
    
                            throw new Error('La dirección ya está siendo utilizada.');
                        } else {
                            // alert("Error interno");
                            throw new Error('Error al actualizar la propiedad');
                        }
                    } else {
                        test2 = true;
                        console.log('Propiedad actualizada correctamente');
    
                        location.reload(true);
                        return response.json();
                    }
                })
                .then(() => {
                    // Mostrar el modal solo si todo el proceso se completó sin errores
                    const modalSuccess = document.getElementById('my_modal_15');
                    modalSuccess.showModal();
                })
                .catch(error => {
                    console.error('Error:', error);
                    // alert("Error interno");
                });
    
            console.log('All beds updated successfully');
            const modalSuccess = document.getElementById('my_modal_15');
            modalSuccess.showModal();
    
        } catch (error) {
            console.error('Error:', error);
            alert("Error interno");
        }
    };
    
    
    const deletebyProperty = async () => {
        let token = localStorage.getItem('authorization');
        try {
            const response = await fetch(`${API_BASE_URL}/v1/property/trueDelete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Authentication ' + token,
                }
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.log(errorMessage);
                throw new Error(errorMessage || 'Error al borrar la propiedad');
            }else{
                window.location.href = API_BASE_URL2;
            }
    
            
        } catch (error) {
            console.error('Error:', error);
            
            let p = document.getElementById("errorBorrar");
            p.innerHTML = "Esta propiedad tiene una reserva que no ha finalizado o quedan menos de 3 días para que empiece, no es posible eliminarla.";
        }
    }

    


    return (
        <div>
            <main className=" md:ml-[110px] lg:ml-[270px] md:mr-[100px] lg:mr-[270px] ">
            <dialog id="my_modal_15" className="modal">
            <div className="modal-box bg-[white] text-black">
                <h3 className="font-bold text-lg">Cargando cambios...</h3>
                <p className="py-4">Propiedad actualizada correctamente</p>
                <div className="modal-action">
                {/* <button className="btn" onclick="this.closest('dialog').close()">Close</button> */}
                </div>
            </div>
            <Modal
                    open={showModal4}
                    onClose={closeModal4}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="modal-box bg-white text-black">
                        <h3 className="font-bold text-lg">¿Estas seguro que quieres eliminar la propiedad?</h3>
                        <p>Esta accion es irreversible</p>
                        <p id='errorBorrar' ></p>
                        <div className="modal-action">
                            <button className="btn boton-cama" onClick={() => deletebyProperty()}>Borrar</button>
                            <button className="btn boton-cama" onClick={closeModal4}>Cerrar</button>
                        </div>
                    </div>
                </Modal>

                <Modal
                    open={showModal5}
                    onClose={closeModal5}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="modal-box bg-[white]">
                        <h3 className="font-bold text-lg text-black">Dia de entrada:</h3>
                            <p>Porfavor, selecciona las fechas deseadas</p>
                         <Calendar2 propid={propiedad.id} />
                       
                          <div className="modal-action flex  items-center">
                             <p className='text-[red] text-center' id='errorDiaEntrada'></p>
                            <button className="btn boton-cama" onClick={closeModal5}>Cancelar</button>
                            <button className="btn boton-cama" onClick={nextModal}>Siguiente</button>
                           
                        </div>
                       
                    </div>
                </Modal>
                <Modal
                    open={showModal6}
                    onClose={closeModal6}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="modal-box bg-[white]">
                        <h3 className="font-bold text-lg text-black">Dia de salida:</h3>
                            <p>Porfavor, selecciona las fechas deseadas</p>
                         <Calendar3 propid={propiedad.id} />
                        
                         <div className="modal-action flex  items-center">
                        <p className='text-[red] text-center' id='errorDiaSalida'></p>
                            <button className="btn boton-cama" onClick={prevModal}>Anterior</button>
                            <button className="btn boton-cama" onClick={reservarTrue}>Reservar</button>
                        </div>
                    </div>
                </Modal>
            </dialog>

                {/* Dirección */}
                <div className="pl-10 lg:pl-0 mt-10 flex items-center justify-start contendor-direcion">
                    <i className="icon-[ion--location-sharp] icon-blue h-7 w-7"></i>
                    <p className='font-bold "'>{propiedad.address} </p>
                </div>

                <div>
                    {/* Imagenes */}
                    <div className="flex flex-col justify-center items-center lg:flex lg:gap-5 lg:justify-center lg:flex-row lg:items-center">
                        {/* Contenido de las imágenes izquierdas */}
                        <div className="md:mr-2 lg:mr-0 flex  gap-5 lg:flex lg:justify-center lg:items-center lg:gap-2 lg:flex-col ">
                            {/* Mostrar las primeras tres imágenes */}
                            {fotosCompletas.slice(0, 2).map((foto, index) => (
                                <img
                                key={index}
                                className="mt-10 rounded-[10px] h-[104px] w-[150px] md:h-[204px] md:w-[215px] lg:h-[130px] lg:w-[195px] object-cover object-center"
                                src={`${API_BASE_URL}/v1/fileCustomer/download/${foto}`}
                                alt={`imagen-propiedad-${index}`}
                                onClick={() => handleImageClick(foto)}
                                onMouseOver={() => handleImageClick(foto)}
                                style={{ objectFit: 'cover' }}
                            />
                            ))}
                        </div>
                        {/* Imagen Central */}
                        <div className="flex justify-center items-center">
                            <img
                                className="mt-10 rounded-[10px] w-[350px] h-[200px] md:h-[260px] md:w-[450px] lg:h-[300px] lg:w-[450px]"
                                src={`${API_BASE_URL}/v1/fileCustomer/download/${imagenCentral || fotosCompletas[0]}`}
                                alt="imagen-propiedad-central"
                            />
                        </div>
                        {/* Contenido de las imágenes derechas */}
                        <div className="md:mr-2 lg:mr-0 flex  gap-5 lg:flex lg:justify-center lg:items-center lg:gap-2 lg:flex-col ">
                            {/* Mostrar las siguientes tres imágenes */}
                            {fotosCompletas.slice(2, 4).map((foto, index) => (
                                <img
                                    key={index}
                                    className="mt-10 rounded-[10px] h-[104px] w-[150px] md:h-[204px] md:w-[215px] lg:h-[130px] lg:w-[195px] object-cover object-center"
                                    src={`${API_BASE_URL}/v1/fileCustomer/download/${foto}`}
                                    alt={`imagen-propiedad-${index + 3}`}
                                    onClick={() => handleImageClick(foto)}
                                    onMouseOver={() => handleImageClick(foto)}
                                />
                            ))}
                        </div>
                    </div>

                   {/* Imagen PIE */}
                    <div className="imagenes-pie flex flex-wrap gap-5 justify-center items-center p-5 md:p-10 lg:gap-[35px]  lg:flex-nowrap lg:ml-10">
                        {/* Mostrar las imágenes restantes */}
                        {fotosCompletas.slice(4).map((foto, index) => (
                            <img
                                key={index}
                                className=" imagenes-pie rounded-[10px] h-[104px] w-[150px] md:h-[204px] md:h-[204px] md:w-[215px]  lg:h-[130px] lg:w-[195px] object-cover object-center"
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
                        <button className="botones-propiedad text-white p-2 rounded-[5px] w-[200px] lg:w-40 md:w-[200px]" onClick={openModal2}>Modificar Imagenes</button>
                    </div>
                )}

                {/* Modal */}
                <Modal open={showModal2} onClose={closeModal2} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div className="modal-box bg-[white] text-black">
                        <h2 className='bolder text-xl'>Subir imágenes nuevas</h2>
                        <div className="modal-content-container flex flex-wrap">
                            {/* Fotos del lado izquierdo */}
                            <div className="group-section">
                                <p>Lado Izquierdo</p>
                                {[...Array(2)].map((_, index) => (
                                    <div key={index} className="file-input-container m-5">
                                        <label htmlFor={`file-input-${index}`} className="file-label mr-5">Foto {index + 1}</label>
                                        <input
                                            type="file"
                                            id={`file-input-${index}`}
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, index)}
                                        />
                                    </div>
                                ))}
                            </div>
                            {/* Fotos del lado derecho */}
                            <div className="group-section">
                                <p>Lado Derecho</p>
                                {[...Array(2)].map((_, index) => (
                                    <div key={index + 2} className="file-input-container m-5">
                                        <label htmlFor={`file-input-${index + 2}`} className="file-label mr-5">Foto {index + 3}</label>
                                        <input
                                            type="file"
                                            id={`file-input-${index + 2}`}
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, index + 2)}
                                        />
                                    </div>
                                ))}
                            </div>
                            {/* Fotos en la parte inferior */}
                            <div className="group-section">
                                <p>Parte Inferior</p>
                                {[...Array(4)].map((_, index) => (
                                    <div key={index + 4} className="file-input-container m-5">
                                        <label htmlFor={`file-input-${index + 4}`} className="file-label mr-5">Foto {index + 5}</label>
                                        <input
                                            type="file"
                                            id={`file-input-${index + 4}`}
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, index + 4)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end ">
                            <div className="modal-action mr-[20px]">
                                <button className=" btn boton-cama" onClick={guardarImagenes}  disabled={isButtonDisabled}>Guardar </button>
                            </div>
                            <div className="modal-action">
                                <button className="btn boton-cama" onClick={closeModal2}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* DESCRIPCION */}
                <div className="flex justify-center mt-10 contendor-descripcion" >
                    {puedeGuardar && (
                        <textarea  id='descripcione' className='area w-[80%] lg:w-[65%] h-[200px] border-gray-950 resize-none' placeholder='Descripcion' defaultValue={propiedad.description}></textarea>
                    )}
                    {!puedeGuardar && (
                        <p>{propiedad.description}</p>
                    )}
                </div>

                {/* PROPIETARIO */}
                <div className="flex md:gap-[50px] mb-10">
                    <div className="lg:flex lg:items-center lg:gap-10 md:flex md:items-center md:gap-10 mt-10 pl-10 md:pl-0 propitario">
                        <div className="flex items-center contenedor-propietario lg:ml-[240px] gap-5">
                            <div className="flex items-center gap-5 flex-col">
                                <div>
                                    <h2 className="font-bold">Propietario</h2>
                                    <p>{propiedad.name} {propiedad.surname}</p>
                                </div>
                                <div>
                                    <img className="imagen-optima h-[80px] w-[80px]  md:h-[100px] md:w-[100px] lg:h-[80px] lg:w-[80px] rounded-[50px]" src={`${API_BASE_URL}/v1/fileCustomer/download/${propiedad.picture}`} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center	align-items h-10 w-30 gap-5 ml-5 mt-[120px] md:mt-[140px] lg:mt-[120px] flex-wrap md:flex-row">
                    {puedeGuardar && (
                            <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[90px] h-10" onClick={updateProperty}>Guardar</button>
                        )}

                        {!puedeGuardar && (
                            <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[90px]  h-10" onClick={reservar}>Reservar</button>
                        )}
                    
                    {puedeGuardar && (
                            <button id='chatear' className="botones-propiedad-elimiar text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[90px]  h-10" onClick={() => openModal4()} >Eliminar</button>
                        )}

                        {!puedeGuardar && (
                            <button id='chatear' className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[90px]  h-10" onClick={() => chatear()} >Chat</button>
                        )}


                        
                        <br /><br />
                    </div>
                </div>
                {/* RATING */}
                <div className="pl-10 md:pl-0 ml-0 lg:ml-[0px] flex propitario">
                            <div className="">
                                <Rating
                                name={`rating-${propiedad.star}`}
                                value={propiedad.stars}
                                precision={0.5}
                                readOnly
                                />
                            </div>
                        </div>

             {/* CARACTERISTICAS */}
                <div className="lg:flex lg:gap-20 md:gap-0 propitario">

                <div className="lg:flex lg:items-center">
                    <div className="flex justify-center"> 
                        <div>
                            <h2 className="font-bold text-lg texto-que-hay  mt-[20px]">¿Qué hay en la vivienda?</h2> 
                            {/* Mostrar las seis primeras características */}
                            <div className="flex gap-7 flex-wrap mt-5 items-center w-[250px] text-black "> 
                                {propiedad.characteristics.slice(0, 4).map((caracteristica, index) => (
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
                                <div className="flex justify-center"> {/* Añadir div con justify-center */}
                                    <button className="botones-propiedad text-white p-2 rounded-[5px] w-40 md:w-40 lg:w-40 mt-[20px]" onClick={openModal}>Mostrar más</button>
                                </div>
                            )}
                            {puedeGuardar && (
                                <div className="flex justify-center"> {/* Añadir div con justify-center */}
                                    <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px] mt-[20px] mt-[20px]" onClick={openModal3}>Modificar</button>
                                </div>
                            )}
                        </div>
                        
                            
                            <Modal open={showModal} onClose={closeModal} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <div className="modal-box bg-[white] text-black">
                                    <h2 className = "font-bold text-xl"> Características</h2>
                                    <div className="modal-content-container flex flex-col gap-5">
                                        {Object.keys(propiedad.characteristics.reduce((groups, caracteristica) => {
                                            const { grupo, ...rest } = caracteristica;
                                            if (!groups[grupo]) groups[grupo] = [];
                                            groups[grupo].push(rest);
                                            return groups;
                                        }, {})).map((grupo, grupoIndex) => (
                                            <div key={grupoIndex} className="grupo-caracteristicas ">
                                                <h3 className="font-bold">{grupo}</h3>
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
                                        <button className="btn boton-modal-cerrar" onClick={closeModal}>Cerrar</button>
                                    </div>
                                </div>
                            </Modal>
                            <Modal open={showModal3} onClose={closeModal3} sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div className="modal-box bg-[white] text-black">
            <h2 className = "font-bold text-xl"> Seleccionar características</h2>
                <div className="modal-content-container flex flex-wrap w-[200px]">
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
                        <button className="btn boton-cama" onClick={saveChanges}>Modificar</button>
                    </div>
                    <div className="modal-action">
                        <button className="btn boton-cama" onClick={closeModal3}>Cerrar</button>
                    </div>
                </div>
            </div>
        </Modal>
                        </div>
                        <dialog id="my_modal_20" className="modal">
                        <div className="modal-box bg-[white] text-black">
                            <h3 className="font-bold text-lg">Error en la dirección</h3>
                            <p className="py-4">La dirección ya está siendo utilizada.</p>
                            <div className="modal-action">
                            <form method="dialog">
                                <button className="btn boton-cama" onClick={ () => location.reload(true)}>Cerrar</button>
                            </form>
                            </div>
                        </div>
                        </dialog>
                        {/* BARRA VERTICAL */}
                        <div className="hidden lg:block bg-secondary h-[200px] w-[2px] lg:ml-[100px] lg:mr-[150px]"></div>
                        {/* CALENDARIO */}
                        <div className='flex flex-col item-center jutify-center mt-20 md:mt-5 lg:mt-0'>
                        <p className='font-bold text-center'> Calendario</p>
                        <Calendar propid={propiedad.id}/>
                        </div>
                    </div>
                    <div className="mt-10 lg:mt-5"></div>
                </div>
                {/* CAMAS */}
                <div className="pl-10 md:pl-0 lg:flex lg:gap-[200px] contneder-cama-premiun propitario">
                    <Camas id={propiedad.id} guardar={puedeGuardar} ></Camas>
                    {/* PREMIUM */}
                    {propiedad.premium ? (
                        <div className="lg:ml-[190px] mt-10 lg:mt-[100px] mt-[100px] mb-[50px]">
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
                            <p className="lg:ml-[190px] text-center font-bold	premiun-texto">NO PREMIUM VERIFICADO</p>
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
