import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../astro.config';

const Propiedades = () => {
    const [reservations, setReservations] = useState([]);
    let userData = JSON.parse(localStorage.getItem('userData'));
    let userId = userData.userId;    
    let token = localStorage.getItem('authorization');

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
        <div className="ml-[50px] lg:ml-[550px] md:ml-[180px] ajustar">
            <div className="mt-5 lg:flex md:flex md:flex-wrap md:gap-5 lg:gap-5 w-[80%]">
                {reservations.map((reservation, index) => (
                    <div key={index} className="relative flex-col mb-10">
                        <img
                            className="mb-5 h-[200px] w-[250px] md:h-[200px] md:w-[200px] lg:h-[200px] lg:w-[275px] rounded-[10px]"
                            src={reservation.propertyPicture 
                                    ? `${API_BASE_URL}/v1/fileCustomer/download/${reservation.propertyPicture}` 
                                    : '/public/casa1.jpg'}
                            alt=""
                        />
                        <div className="w-[260px] md:w-[200px] lg:w-[300px]">
                            <p>{reservation.propertyAddress}</p>
                            <p>Propietario: {reservation.receiverUserName} {reservation.receiverUserSurname}</p>
                            <p>Realizó intercambio el {new Date(reservation.dateStart).toLocaleDateString()} - {new Date(reservation.dateEnd).toLocaleDateString()}</p>
                            <p>Con la propiedad de {reservation.propertyAddress}</p>
                        </div>
                        <img
                            className="absolute -top-[-30%] left-[50%] lg:left-[70%] transform -translate-x-1/2 rounded-full w-[80px] h-[80px]"
                            src={`${API_BASE_URL}/v1/fileCustomer/download/${reservation.receiverPicture}`}
                            alt=""
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Propiedades;
