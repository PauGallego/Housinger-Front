import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../astro.config';
import { API_BASE_URL2 } from '../../astro.config';
import { Modal, Button, TextField } from '@mui/material';
import { Icon } from '@iconify/react';


const MisPropiedades = () => {
    const [propiedades, setPropiedades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [direccion, setDireccion] = useState('');
    const [error, setError] = useState('');

    const handleModalOpen = () => {
        setOpenModal(true);
    };
    
    const handleModalClose = () => {
        setOpenModal(false);
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
    }, []);

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
                            const data = await response.json();
                            console.log(data);

                            window.location.href = `${API_BASE_URL2}/user_prop?id=${data.id}`;
                        } catch (error) {
                            setError('La dirección ya esta en uso');
                            console.error('Error Creating property:', error);
                        }
                    };
                    fetchData2();
                } else {
                    setError('La dirección no pudo ser encontrada. Por favor, inténtelo de nuevo.');
                }
            });
        }

    const borrarPropiedad = async (id) => {
        let token = localStorage.getItem('authorization');
        try {
            const response = await fetch(`${API_BASE_URL}/v1/property/trueDelete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Authentication ' + token,
                }
                
            });
            const data = await response.json();
            location.reload(true);
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    }
                    return (
                        <div className="mt-10  w-[80%]">
                            <h2 className="ajustar md:ml-[180px] lg:ml-[550px] font-bold text-xl text-center md:text-left lg:text-left">Mis propiedades</h2>
                            <div className="ajustar ml-[50px] lg:ml-[550px] md:ml-[180px]">
                                <div className="mt-5 lg:flex md:flex md:flex-wrap gap-5">
                                {propiedades.map((propiedad, index) => (
                                <div className="flex-col mb-10 relative" key={index}>
                                    <button className="absolute top-0 right-0 z-10" onClick={() => borrarPropiedad(propiedad.propertyId)}>
                                    <Icon icon="flowbite:x-circle-solid" className="h-[25px] w-[25px] red text-red" />
                                    </button>
                                    <a href={API_BASE_URL2 + "/user_prop?id=" + propiedad.propertyId}>
                                        <img
                                            className="mb-5 h-[200px] w-[250px] md:h-[200px] md:w-[200px] lg:h-[200px] lg:w-[275px] rounded-[10px]"
                                            src={propiedad.foto ? `${API_BASE_URL}/v1/fileCustomer/download/${propiedad.foto}` : `${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`}
                                            alt=""
                                        />
                                        <p>{propiedad.address}</p>
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
            </div>
        </div>
    );
};

export default MisPropiedades;