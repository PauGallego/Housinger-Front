import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../astro.config';
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

    const handleModalClose2 = (id) => {
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
        <div className="md:flex md:flex-col lg:flex-row lg:items-center lg:justify-center md:pl-[0px] lg:pl-[]">
            <div className="mt-5 lg:flex md:flex md:flex-wrap md:gap-5 lg:gap-5 w-[80%]">
                {reservations.map((reservation, index) => (
                    <div key={index} className="relative flex-col mb-10 relative" >
                        <img
                            className="mb-5 h-[200px] w-[250px] md:h-[200px] md:w-[200px] lg:h-[200px] lg:w-[275px] rounded-[10px]"
                            src={reservation.propertyPicture 
                                    ? `${API_BASE_URL}/v1/fileCustomer/download/${reservation.propertyPicture}` 
                                    : '/public/casa1.jpg'}
                            alt=""
                        />
                         <button className="absolute top-0 right-6 " onClick={() => handleModalOpen2(reservation.id)}>
                                    <Icon icon="flowbite:x-circle-solid" className="h-[25px] w-[25px] red text-[red]"  />
                        </button>
                        <div className="w-[260px] md:w-[200px] lg:w-[300px]">
                            <p>{reservation.propertyAddress}</p>
                            <p>Propietario: {reservation.receiverUserName} {reservation.receiverUserSurname}</p>
                            <p>Reserva para los dias <br/> {new Date(reservation.dateStart).toLocaleDateString()} - {new Date(reservation.dateEnd).toLocaleDateString()}</p>
                        
                        </div>
                        <img
                            className="absolute -top-[-30%] left-[50%] lg:left-[70%] transform -translate-x-1/2 rounded-full w-[80px] h-[80px]"
                            src={`${API_BASE_URL}/v1/fileCustomer/download/${reservation.receiverPicture}`}
                            alt=""
                        />
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
                        <p>Esta accion es irreversible</p>
                        <p id="errosmsg"></p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => cancelar()}>Cancelar</button>
                            <button className="btn" onClick={handleModalClose2}>Cerrar</button>
                        </div>
                    </div>
                </Modal>
        </div>
    );
};

export default Propiedades;
