import React, { useEffect, useState } from 'react';
import Chatroom from './ChatRoom.jsx';
import { API_BASE_URL } from '../../astro.config.js';
import '../../global.css';

const MyComponent = () => {
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const receiverParam = params.get('receiver');

      if (receiverParam) {
        setReceiverId(receiverParam);
        setIsLoading(false); // No necesitamos cargar más datos si el receiverId está presente
      } else {
        try {
          const response = await fetch(`${API_BASE_URL}/v1/chat/getSent/${senderId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Authentication ' + localStorage.getItem('authorization'),
            }
          });

          const data = await response.json();
          if (data && data.length > 0) {
            setReceiverId(data[0].receiverId);
          }
          setIsLoading(false); // Finaliza la carga independientemente de si se encuentra un receiverId
        } catch (error) {
          console.error('Error loading chat history:', error);
          setIsLoading(false); // Manejo de error: finaliza la carga
        }
      }
    };

    fetchData();

    let data = JSON.parse(localStorage.getItem('userData'));
    if (data && data.customerId) {
      setSenderId(data.customerId);
    }
  }, [senderId]);

  return (
    <div>
      {isLoading ? (
        <div className='flex justify-center items-center'>
          <div className='md:flex md:flex-col md:h-[500px] md:w-[500px] md:justify-center md:items-center lg:flex lg:flex-col lg:h-[500px] lg:w-[500px] lg:justify-center lg:items-center'>
              <img className='ajustar-carga' src="../../cargar.gif" alt="Cargando..." />
          </div>
        </div>
      ) : receiverId ? (
        <Chatroom senderId={senderId} receiverId={receiverId} client="svelte:only" />
      ) : (
        <div className='flex justify-center items-center'>
          <div className='md:flex md:flex-col md:h-[500px] md:w-[500px] md:justify-center md:items-center lg:flex lg:flex-col lg:h-[500px] lg:w-[500px] lg:justify-center lg:items-center'>
              <img className='ajustar-carga' src="../../cargar.gif" alt="Cargando..." />
              <p className='text-center mt-10 text-xl font-bold'>No hay chats previos...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComponent;
