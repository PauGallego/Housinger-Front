import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../astro.config';
import { API_BASE_URL2 } from '../../astro.config';
import { Modal, Button, TextField } from '@mui/material';
import { Icon } from '@iconify/react';

const Propiedades = () => {
    const [reservations, setReservations] = useState([]);
    const [idProp, setIdProp] = useState([]);
    const [idReserv, setIdReserv] = useState([]);
    const [openModal2, setOpenModal2] = useState(false);
    let userData = JSON.parse(localStorage.getItem('userData'));
    let userId = userData.userId;    
    let token = localStorage.getItem('authorization');

    const handleModalOpen2 = (id) => {
        setIdReserv(id);
        setOpenModal2(true);
    };

    const handleModalClose2 = () => {
        setOpenModal2(false);
    };

    const cancelar = () => {
        fetch(`${API_BASE_URL}/v1/reservation/deleteTrue/${idReserv}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Authentication ' + token,
            }
        })
        .then(response => {
            if (!response.ok) {
                console.log(response);
                throw new Error('Error al cancelar la reserva');
            }
            console.log('Reserva cancelada exitosamente');
            location.reload(true);
        })
        .catch(error => {
            console.error('Error:', error);
          
            let p = document.getElementById("errosmsg");
            p.innerHTML = "Una de las dos reservas ha finalizado o quedan menos de 3 días para que empiece, no es posible cancelar..";
    
        });
    };
    
    useEffect(() => {
        fetch(`${API_BASE_URL}/v1/reservation/getUser/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Authentication ' + localStorage.getItem('authorization')
            },
        })
            .then(response => response.json())
            .then(data => setReservations(data))
            .catch(error => console.error('Error fetching reservations:', error));
    }, [userId, token]);

    return (
        <div className="mt-10 flex flex-col items-start ml-[15vw] lg:ml-[25vw]">
            <h2 className="font-bold text-xl">Mis reservas</h2>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {reservations.map((reservation, index) => (
                    <div 
                        className="flex flex-col items-center mb-10 relative cursor-pointer" 
                        key={index}
                        onClick={() => window.location.href = `${API_BASE_URL2}/user_prop?id=${reservation.reservationPropertyId}`}
                    >
                        <button className="absolute top-0 right-0 z-10" onClick={(e) => {
                            e.stopPropagation();
                            handleModalOpen2(reservation.id);
                        }}>
                            <Icon icon="flowbite:x-circle-solid" className="h-5 w-5 text-red-500" />
                        </button>
                        <div className="relative">
                            <img
                                className="mb-5 max-h-48 w-[300px] rounded"
                                src={reservation.propertyPicture 
                                        ? `${API_BASE_URL}/v1/fileCustomer/download/${reservation.propertyPicture}` 
                                        : `${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`}
                                alt=""
                            />
                            <img
                                className="absolute bottom-8 right-0 w-20 h-20 rounded-full mr-2 mb-2"
                                src={`${API_BASE_URL}/v1/fileCustomer/download/${reservation.receiverPicture}`}
                                alt=""
                            />
                        </div>
                        <p className='w-[300px] text-center'>{reservation.propertyAddress}</p>
                        <div className="flex items-center mt-2">
                            <p className='w-[300px] text-center'>Propietario: {reservation.receiverUserName} {reservation.receiverUserSurname}</p>
                        </div>
                        <p className='w-[300px] text-center'>Reserva para los días <br/> {new Date(reservation.dateStart).toLocaleDateString()} - {new Date(reservation.dateEnd).toLocaleDateString()}</p>
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
                    <h3 className="font-bold text-lg">¿Estas seguro que quieres cancelar la reserva?</h3>
                    <p>Esta acción es irreversible</p>
                    <p id="errosmsg"></p>
                    <div className="modal-action">
                        <button className="btn boton-cama" onClick={() => cancelar()}>Cancelar</button>
                        <button className="btn boton-cama" onClick={handleModalClose2}>Cerrar</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Propiedades;
