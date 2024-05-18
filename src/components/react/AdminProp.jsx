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
    
    try{
        let userId = JSON.parse(localStorage.getItem('userData')).userId;
    }catch{
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
                }else{
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

            if(response){
                location.reload(true);
  
            }
           
            
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    }
    
    return (
        <div className="mt-10">
            <div className="ml-[50px] lg:ml-[550px] md:ml-[180px]">
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
                                <p>{propiedad.address}</p>
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
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">¿Estás seguro que quieres eliminar la propiedad?</h3>
                        <p>Esta acción es irreversible</p>
                        <div className="modal-action">
                            <Button variant="contained" color="primary" onClick={() => borrarPropiedad(idProp)}>Borrar</Button>
                            <Button variant="contained" onClick={handleModalClose2}>Cerrar</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default MisPropiedades;
