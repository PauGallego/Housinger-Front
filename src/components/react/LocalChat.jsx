import React, { useEffect, useState } from 'react';
import Chatroom from './ChatRoom.jsx';

const MyComponent = () => {
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const receiverParam = params.get('receiver');
    if (receiverParam) {
      setReceiverId(receiverParam);
    }


    let data = JSON.parse(localStorage.getItem('userData'));
    if (data && data.customerId) {
      setSenderId(data.customerId);
    }
  }, []); 

  return (
    <div>
      
      {(senderId !== null && receiverId !== null) ? (
        <Chatroom senderId={senderId} receiverId={receiverId} client="svelte:only" />
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default MyComponent;
