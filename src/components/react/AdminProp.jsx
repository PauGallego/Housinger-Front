import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@mui/material';
import { Icon } from '@iconify/react';
import { API_BASE_URL, API_BASE_URL2 } from '../../astro.config';

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

    try {
        let userId = JSON.parse(localStorage.getItem('userData')).userId;
    } catch {
        window.location.href = `${API_BASE_URL2}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/v1/propertyUser/get/all`);
                const data = await response.json();
                setPropiedades(data);

                const isAdmin = await fetch(`${API_BASE_URL}/v1/user/admin/${userId}`);

                if (isAdmin.ok) {
                    localStorage.setItem("admin", true);
                } else {
                    window.location.href = `${API_BASE_URL2}`;
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching property data:', error);
            }
        };

        fetchData();
    }, []);

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

    const filteredPropiedades = propiedades.filter(propiedad =>
        propiedad.address.toLowerCase().includes(direccion.toLowerCase())
    );

    return (
        <div className="mt-10">
            <div className="flex justify-start ml-[10vw]  mb-5">
                <input
                    type="text"
                    placeholder="Buscar por dirección"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="border rounded-md p-2 w-full max-w-md"
                />
            </div>
                <div className="flex flex-wrap justify-start pl-[50px] md:pl-[200px] gap-5">
                    {filteredPropiedades.map((propiedad, index) => (
                        <div className="relative mb-10" key={index}>
                            <button className="absolute top-2 right-2" onClick={() => handleModalOpen2(propiedad.propertyId)}>
                                <Icon icon="flowbite:x-circle-solid" className="h-6 w-6 text-red-600" />
                            </button>
                            <a href={API_BASE_URL2 + "/user_prop?id=" + propiedad.propertyId}>
                                <img
                                    className="mb-3 h-52 w-full md:w-[300px] lg:w-[350px] rounded-md"
                                    src={propiedad.foto ? `${API_BASE_URL}/v1/fileCustomer/download/${propiedad.foto}` : `${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`}
                                    alt=""
                                />
                                <p className="text-center w-full md:w-[300px] lg:w-[350px]">{propiedad.address}</p>
                            </a>
                        </div>
                    ))}
                </div>

            <Modal
                open={openModal2}
                onClose={handleModalClose2}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div className="bg-white p-5 rounded-md shadow-md">
                    <h3 className="font-bold text-lg">¿Estás seguro que quieres eliminar la propiedad?</h3>
                    <p>Esta acción es irreversible</p>
                    <p id='errorBorrar' ></p>
                    <div className="flex justify-end mt-5">
                        <Button variant="contained" color="primary" onClick={() => borrarPropiedad(idProp)}>Borrar</Button>
                        <Button variant="contained" onClick={handleModalClose2} className="ml-2">Cerrar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MisPropiedades;
