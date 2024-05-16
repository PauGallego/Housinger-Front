import React, { useEffect, useState } from 'react';
import Chatroom from './ChatRoom.jsx';
import { API_BASE_URL } from '../../astro.config.js';
import '../../global.css';

const MyComponent = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [proposerId, setProposerId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
    const [data, setData] = useState({});

  let userData = JSON.parse(localStorage.getItem('userData'));
  
  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');

        const response = await fetch(`${API_BASE_URL}/v1/reservation/get/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }

        });
        

        const data = await response.json();
        
        if(userData.userId != data.receiverUserId ){

            window.location.href = '/';
        }else{

            setProposerId(data.proposerId);
            setReceiverId(data.receiverId);
            setData(data);
        }


        console.log(data);



      if (id) {
        
        setProposerId(id);
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

  return (
    <div>
      {isLoading ? (
        <div className='flex justify-center items-center'>
          <div className='md:flex md:flex-col md:h-[500px] md:w-[500px] md:justify-center md:items-center lg:flex lg:flex-col lg:h-[500px] lg:w-[500px] lg:justify-center lg:items-center'>
              <img className='ajustar-carga' src="../../cargar.gif" alt="Cargando..." />
          </div>
        </div>
      ) : (
        <div className='flex justify-center items-center'>
          <div className=''>
              <p>{data.proposerName} {data.proposerSurname}</p>
              <img  className="w-[200px]"  src={`${API_BASE_URL}/v1/fileCustomer/download/${data.proposerPicture}`}  alt="" />
              <p>Esta ineresado/a en la propiedad </p>
              <img  className="w-[200px]"   src={data.propertyPicture ? `${API_BASE_URL}/v1/fileCustomer/download/${data.propertyPicture}` : `${API_BASE_URL}/v1/fileCustomer/download/casa1.jpg`} />
              <p>{data.propertyAddress}</p>
              <p>Para las fechas</p>
                <p>{formatDate(data.dateStart)} - {formatDate(data.dateEnd)}</p>

                <button>Ver Propiedades</button>
                <button>Rechazar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComponent;
