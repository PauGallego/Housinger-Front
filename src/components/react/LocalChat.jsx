import React, { useEffect, useState } from 'react';
import Chatroom from './ChatRoom.jsx';
import { API_BASE_URL } from '../../astro.config.js';

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
        <p>Cargando...</p>
      ) : receiverId ? (
        <Chatroom senderId={senderId} receiverId={receiverId} client="svelte:only" />
      ) : (
        <p>No hay chats previos..</p>
      )}
    </div>
  );
};

export default MyComponent;
