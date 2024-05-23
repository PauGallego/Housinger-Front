import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../astro.config';
import { API_BASE_URL2 } from '../../astro.config';
import { Modal, Button, TextField } from '@mui/material';
import { Icon } from '@iconify/react';
import '../../global.css';

const MisPropiedades = () => {
    const [propiedades, setPropiedades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);
    const [direccion, setDireccion] = useState('');
    const [error, setError] = useState('');
    const [idProp, setIdProp] = useState('');

    const handleModalOpen = () => {
        setOpenModal(true);
    };
    
    const handleModalClose = () => {
        setOpenModal(false);
    };

    const handleModalOpen2 = (id) => {
        setIdProp(id);
        setOpenModal2(true);
    };
    
    const handleModalClose2 = () => {
        setOpenModal2(false);
    };

    let userId = JSON.parse(localStorage.getItem('userData')).userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/v1/propertyUser/get/${userId}`);
                const data = await response.json();
                setPropiedades(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching property data:', error);
            }
        };

        fetchData();
    }, [userId]);

    const nuevaPropiedad = () => {
        if (!direccion) {
            setError('Introduce una dirección');
            return;
        }
    
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const fetchData2 = async () => {
                        try {
                            const response = await fetch(`${API_BASE_URL}/v1/property/new/${userId}/${direccion}`);
                            const responseData = await response.json();
    
                            if (!response.ok) {
                                throw new Error(responseData.message || 'Error creating property');
                            }
    
                            console.log(responseData);
                            window.location.href = `${API_BASE_URL2}/user_prop?id=${responseData.id}`;
                        } catch (error) {
                            setError('La dirección ya está en uso');
                            console.error('Error Creating property:', error);
                        }
                    };
                    fetchData2();
                } else {
                    setError('La dirección no pudo ser encontrada. Por favor, inténtelo de nuevo.');
                }
            });
    };

    const borrarPropiedad = async (id) => {
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
                location.reload(true);
            }
    
            
        } catch (error) {
            console.error('Error:', error);
            
            let p = document.getElementById("errorBorrar");
            p.innerHTML = "Esta propiedad tiene una reserva que no ha finalizado o quedan menos de 3 días para que empiece, no es posible eliminarla.";
        }
    };

    return (
        <div className="mt-10">
            <h2 className="md:pl-[180px] lg:pl-[250px] arreglar-texto font-bold text-xl pl-10 md:pl-[0px]">Mis propiedades</h2>
            <div className="md:flex md:flex-col lg:flex-row pl-10 md:pl-[0px] lg:pr-[350px] md:items-center md:justify-center lg:pr-[350px] lg:items-center lg:justify-center lg:pr-[350px]">
                <div className="mt-5 lg:flex md:flex md:flex-wrap gap-5">
                    {propiedades.map((propiedad, index) => (
                        <div className="flex-col mb-10 relative" key={index}>
                            <button className="absolute top-0 right-0 z-10" onClick={() => handleModalOpen2(propiedad.propertyId)}>
                                <Icon icon="flowbite:x-circle-solid" className="h-[25px] w-[25px] red text-[red]" />
                            </button>
                            <a href={API_BASE_URL2 + "/user_prop?id=" + propiedad.propertyId}>
                                <img
                                    className="mb-5 h-[200px] w-[250px] md:h-[200px] md:w-[200px] lg:h-[200px] lg:w-[275px] rounded-[10px]"
                                    src={propiedad.foto ? `${API_BASE_URL}/v1/fileCustomer/download/${propiedad.foto}` : `${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`}
                                    alt=""
                                />
                                <p className=' w-[250px]  md:w-[200px]  lg:w-[275px]'>{propiedad.address}</p>
                            </a>
                        </div>
                    ))}

                    <div className="flex-col mb-10">
                        <button onClick={handleModalOpen}>
                            <img
                                className="mb-5 h-[200px] w-[250px] md:h-[200px] md:w-[200px] lg:h-[200px] lg:w-[275px] rounded-[10px]"
                                src={`${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`}
                                alt=""
                            />
                            <p>Añadir propiedad</p>
                        </button>
                    </div>
                </div>

                <Modal
                    open={openModal}
                    onClose={handleModalClose}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Crear nueva propiedad</h3>
                        <p>Introduce una dirección válida</p>
                        <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                        <p className="text-red">{error}</p>
                        <div className="modal-action">
                            <button className="btn" onClick={nuevaPropiedad}>Crear</button>
                            <button className="btn" onClick={handleModalClose}>Cerrar</button>
                        </div>
                    </div>
                </Modal>

                <Modal
                    open={openModal2}
                    onClose={handleModalClose2}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">¿Estás seguro que quieres eliminar la propiedad?</h3>
                        <p>Esta acción es irreversible</p>
                        <p id='errorBorrar'></p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => borrarPropiedad(idProp)}>Borrar</button>
                            <button className="btn" onClick={handleModalClose2}>Cerrar</button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default MisPropiedades;
