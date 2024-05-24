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
  const [customerId, setCustomerId] = useState(null);
  const [data, setData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [propiedades, setPropiedades] = useState([]);
  const [propId, setPropId] = useState(false);

  let userData = JSON.parse(localStorage.getItem('userData'));

  
  const openModal = (id) =>{
    setShowModal3(false);
    setPropId(id);

    setShowModal(true);
}

const closeModal = () =>{
    setShowModal(false);
}

const openModal2 = () =>{
    setShowModal2(true);
}

const closeModal2 = () =>{
    setShowModal2(false);
}

const openModal4 = () =>{
  setShowModal4(true);
}

const closeModal4 = () =>{
  setShowModal4(false);
}

const openModal3 = () =>{
    fetchPropData();
    localStorage.removeItem("first_date");
    localStorage.removeItem("last_date");
    setShowModal3(true);
}

const closeModal3 = () =>{
    setShowModal3(false);
}

const nextModal = () =>{
    let day = localStorage.getItem("first_date");
    let error2 = document.getElementById("errorDiaEntrada");

    if (!day) {
        error2.innerHTML = "¡Debes seleccionar una fecha!";
        return;
    }
    setShowModal(false);
    setShowModal2(true);
    
}



const prevModal = () =>{
  localStorage.removeItem("first_date");
  localStorage.removeItem("last_date");
  setShowModal(true);
  setShowModal2(false);
}

const fetchPropData = () =>{

  const fetchData = async () => {
      try {
          const response = await fetch(`${API_BASE_URL}/v1/propertyUser/get/${proposerId}`);
          const data = await response.json();
          setPropiedades(data);

          console.log(data);
      } catch (error) {
          console.error('Error fetching property data:', error);
      }
  };

      
  fetchData();
 
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
              'Content-Type': 'application/json',
              'Authorization': 'Authentication ' + localStorage.getItem('authorization')
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
                'Authorization': 'Authentication ' + localStorage.getItem('authorization')
            }

        });
        

        const data = await response.json();

        if(data.type == "confirmed" ){
          window.location.href = `${API_BASE_URL2}/chat?error=true`;
        }

        
        if(userData.userId != data.receiverUserId ){

          window.location.href = `${API_BASE_URL2}/chat?error=true`;
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

    fetchData();

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

   const url = `${API_BASE_URL}/v1/reservation/declineOffer/${reservId}/${receiverId}/${proposerId}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Authentication ' + localStorage.getItem('authorization')
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
        <div className=' flex flex-col items-center	justify-center gap-10 h-[auto] pb-[50px]'>
          <div className='flex flex-col md:flex-row gap-10 contendor-xd'>
              <div>
                <p className='text-white'>{data.proposerName} {data.proposerSurname}</p>
                <img  className="w-[250px] h-[221px] rounded-[10px]"  src={`${API_BASE_URL}/v1/fileCustomer/download/${data.proposerPicture}`}  alt="" />
                <p className='text-white'>Esta ineresado/a en la propiedad </p>
              </div>
              <div className='mt-6'>
                <img  className="w-[250px] h-[221px] rounded-[10px]"   src={data.propertyPicture ? `${API_BASE_URL}/v1/fileCustomer/download/${data.propertyPicture}` : `${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`} />
                <p className='text-white w-[250px]'>{data.propertyAddress}</p>
                <p className='text-white'>Para las fechas</p>
                <p className='text-white'>{formatDate(data.dateStart)} - {formatDate(data.dateEnd)}</p>
              </div>
          </div>
          <div className='flex gap-5'>
                <button className='boton-aceptar' onClick={openModal3}>Ver Propiedades</button>
                <button className='boton-rechazar' onClick={openModal4}>Rechazar</button>
          </div>
        </div>
      )}
       <Modal
                    open={showModal3}
                    onClose={closeModal3}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="modal-box bg-[white]">
                        <h3 className="font-bold text-lg text-black">Porfavor, selecciona la propiedad deseada</h3>

                        {propiedades.map((propiedad, index) => (
                                <div className="flex-col mb-10 relative" key={index}>
                                
                                    <button onClick={ () => openModal(propiedad.propertyId)}>
                                        <img
                                            className="mb-5 h-[200px] w-[250px] md:h-[200px] md:w-[200px] lg:h-[200px] lg:w-[275px] rounded-[10px]"
                                            src={propiedad.foto ? `${API_BASE_URL}/v1/fileCustomer/download/${propiedad.foto}` : `${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`}
                                            alt=""
                                        />
                                        <p>{propiedad.address}</p>
                                    </button>
                                </div>
                            ))}
                        
                         <div className="modal-action flex  items-center">
                        <p className='text-[red] text-center' id='errorDiaSalida'></p>
                            <button className="btn boton-modal" onClick={closeModal3}>Cerrar</button>
                        </div>
                    </div>
                </Modal>


                <Modal
                    open={showModal}
                    onClose={closeModal}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                  
                  <div className="modal-box bg-[white]">
                        <h3 className="font-bold text-lg text-black">Dia de entrada:</h3>
                            <p>Porfavor, selecciona las fechas deseadas</p>
                         <Calendar2 propid={propId} />
                       
                          <div className="modal-action flex  items-center">
                             <p className='text-[red] text-center' id='errorDiaEntrada'></p>
                            <button className="btn boton-cama" onClick={closeModal}>Cancelar</button>
                            <button className="btn boton-cama" onClick={nextModal}>Siguiente</button>
                           
                        </div>
                       
                    </div>
                </Modal>

                <Modal
                    open={showModal2}
                    onClose={closeModal2}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="modal-box bg-[white]">
                        <h3 className="font-bold text-lg text-black">Dia de salida:</h3>
                            <p>Porfavor, selecciona las fechas deseadas</p>
                         <Calendar3 propid={propId} />
                        
                         <div className="modal-action flex  items-center">
                        <p className='text-[red] text-center' id='errorDiaSalida'></p>
                            <button className="btn boton-cama" onClick={prevModal}>Anterior</button>
                            <button className="btn boton-cama" onClick={fianlizarReserva}>Reservar</button>
                        </div>
                    </div>
                </Modal>
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
