import React, { useEffect, useState } from 'react';
import Chatroom from './ChatRoom.jsx';
import { API_BASE_URL } from '../../astro.config.js';
import { API_BASE_URL2 } from '../../astro.config.js'; 
import '../../global.css';
import { set } from 'date-fns';
import Calendar2 from './CalendarioSelec.jsx'
import Calendar3 from './CalendarioSelec2.jsx'
import { Modal, Button, TextField } from '@mui/material';

const MyComponent = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [proposerId, setProposerId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [reservId, setReservId] = useState(null);
  const [reservId2, setReservId2] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [data, setData] = useState({});
  const [data2, setData2] = useState({});
  const [propId, setPropId] = useState(false);
  const [showModal4, setShowModal4] = useState(false);


  const openModal4 = () =>{
    setShowModal4(true);
  }
  
  const closeModal4 = () =>{
    setShowModal4(false);
  }


const fianlizarReserva = async () =>{
  let last_date = localStorage.getItem("last_date");
  let error2 = document.getElementById("errorDiaSalida");
      
  if (!last_date) {
      error2.innerHTML = "¡Debes seleccionar una fecha!";
      return;
  }
  
  try {


      const reservationData = {
          reservationUserId:  JSON.parse(localStorage.getItem('userData')).userId,
          reservationPropertyId: propId, 
          dateStart:  new Date (localStorage.getItem("first_date")), 
          dateEnd:  new Date (localStorage.getItem("last_date"))
      };

      console.log(JSON.stringify(reservationData));

      const response = await fetch(`${API_BASE_URL}/v1/reservation/contraOffert?previusId=${reservId}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(reservationData)
      });

      if (response.ok) {
          console.log('Reserva realizada con éxito.');

          window.location.href = `${API_BASE_URL2}/chat?receiver=${customerId}`;
   
          closeModal2();
      } else {
     
          console.error('Error al realizar la reserva:', response.statusText);
      }
  } catch(error) {
     
      console.error('Error:', error);
  }
  
}




  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      setReservId(id);
        const response = await fetch(`${API_BASE_URL}/v1/reservation/get/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }

        });
        

        const data = await response.json();

        let userData = JSON.parse(localStorage.getItem('userData'));
        
        if(userData.userId != data.receiverUserId ){

            console.log("no es el usuario");
            console.log(userData.userId);
            console.log(data.receiverUserId);

            window.location.href = `${API_BASE_URL2}/chat`;

        }else{  

            setProposerId(data.reservationUserId);
            setReceiverId(data.receiverUserId);
            setCustomerId(data.reservationCustomerId);
            setData(data);
        }


        console.log(data);



      if (id) {

        setIsLoading(false); 
      } 


    };


    const fetchData2 = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id2');
      setReservId2(id);
        const response = await fetch(`${API_BASE_URL}/v1/reservation/get/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }

        });
        

        const data = await response.json();
        
        let userData = JSON.parse(localStorage.getItem('userData'));


        console.log(data);

        setData2(data);

       



      if (id) {

        setIsLoading(false); 
      } 


    };

    fetchData();
    fetchData2();
  

    let data = JSON.parse(localStorage.getItem('userData'));

  

  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  };

  let rechazar = async () => {

   const url = `${API_BASE_URL}/v1/reservation/declineOfferTrue/${reservId}/${reservId2}/${receiverId}/${proposerId}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      await response.response;
      if(response){
        window.location.href = `${API_BASE_URL2}/chat?receiver=${customerId}`;
   
      }
    
    } catch (error) {
      console.error('Error:', error);

    }
  }

  let aceptar = async () => {

    const url = `${API_BASE_URL}/v1/reservation/acceptOffer/${reservId}/${reservId2}/${receiverId}/${proposerId}`;
 
     try {
       const response = await fetch(url, {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
         }
       });
 
       await response.response;
       if(response){
         window.location.href = `${API_BASE_URL2}/chat?receiver=${customerId}`;
    
       }
     
     } catch (error) {
       console.error('Error:', error);
 
     }
   }
 

  return (
    <div>
      {isLoading ? (
        <div className='flex justify-center items-center'>
          <div className='md:flex md:flex-col md:h-[500px] md:w-[500px] md:justify-center md:items-center lg:flex lg:flex-col lg:h-[500px] lg:w-[500px] lg:justify-center lg:items-center'>
              <img className='ajustar-carga' src="../../cargar.gif" alt="Cargando..." />
          </div>
        </div>
      ) : (
        <div className='flex justify-center items-center gap-10 flex-col'>
          <div className='lg:flex lg:flex-row justify-center items-center'>
          <div className='text-[20px] contedor-propiedad1'>
              <p className='blanco-propieda-intercambio'>{data.proposerName} {data.proposerSurname}</p>
              <img  className="w-[200px]"  src={`${API_BASE_URL}/v1/fileCustomer/download/${data.proposerPicture}`}  alt="" />
              <p className='blanco-propieda-intercambio'>Esta ineresado/a en la propiedad </p>
              <img  className="w-[200px] h-[200px] rounded-md"   src={data.propertyPicture ? `${API_BASE_URL}/v1/fileCustomer/download/${data.propertyPicture}` : `${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`} />
              <p className='blanco-propieda-intercambio'>{data.propertyAddress}</p>
              <p className='blanco-propieda-intercambio'>Para las fechas</p>
                <p className='blanco-propieda-intercambio'>{formatDate(data.dateStart)} - {formatDate(data.dateEnd)}</p>
          </div>
          <i class="icon-[mdi--home-switch-outline] ml-[120px] lg:ml-[0px] text-[100px]"></i>
          <div className='text-[20px] contedor-propiedad2'>
              <p className='blanco-propieda-intercambio'>{data2.proposerName} {data2.proposerSurname}</p>
              <img  className="w-[200px]"  src={`${API_BASE_URL}/v1/fileCustomer/download/${data2.proposerPicture}`}  alt="" />
              <p className='blanco-propieda-intercambio'>Esta ineresado/a en la propiedad </p>
              <img  className="w-[200px] h-[200px] rounded-md"   src={data2.propertyPicture ? `${API_BASE_URL}/v1/fileCustomer/download/${data2.propertyPicture}` : `${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`} />
              <p className='blanco-propieda-intercambio'>{data2.propertyAddress}</p>
              <p className='blanco-propieda-intercambio'>Para las fechas</p>
                <p className='blanco-propieda-intercambio'>{formatDate(data2.dateStart)} - {formatDate(data2.dateEnd)}</p>
          </div>
          </div>
          <div className='flex gap-5'>
            <button className='boton-aceptar-intercambio' onClick={ () => aceptar()}>Aceptar</button>
            <button className='boton-rechazar-intercambio' onClick={ openModal4}>Rechazar</button>
          </div>
        </div>
      )}
       <Modal
                    open={showModal4}
                    onClose={closeModal4}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="modal-box bg-[white]">
                        <h3 className="font-bold text-lg text-black">¿Esas seguro?</h3>
                            <p>¿Deseas Rechazar la oferta?</p>              
                         <div className="modal-action flex  items-center">
                        <p className='text-[red] text-center' id='errorDiaSalida'></p>
                            <button className="btn" onClick={closeModal4}>Cancelar</button>
                            <button className="btn" onClick={ () => rechazar()}>Rechazar</button>
                        </div>
                    </div>
                </Modal>
    </div>
  );
};

export default MyComponent;
