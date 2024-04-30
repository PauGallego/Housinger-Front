import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from "sockjs-client/dist/sockjs";
import { API_BASE_URL } from '../../astro.config.js';
import './ChatRoom.css';
// Importar la función parse de date-fns
import { parse } from 'date-fns';

var stompClient = null;

const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState([]);
    const [userData, setUserData] = useState({
        senderId: '',
        receiverId: '',
        connected: false,
        message: ''
    });

    useEffect(() => {
        if (userData.receiverId && userData.senderId) {
            connect();
            fetchData(); // Load chat history when senderId and receiverId are set
        }
    }, [userData.receiverId, userData.senderId]);


   // Función para cargar el historial de chat
   const fetchData = async () => {
    try {
        const sentResponse = await fetch(`${API_BASE_URL}/v1/chat/getSent/${userData.senderId}`);
        const sentData = await sentResponse.json();

        const receivedResponse = await fetch(`${API_BASE_URL}/v1/chat/getReceived/${userData.senderId}`);
        const receivedData = await receivedResponse.json();

        // Combinar mensajes enviados y recibidos
        const allMessages = sentData.concat(receivedData);

        // Ordenar los mensajes por fecha utilizando date-fns parse
        allMessages.sort((a, b) => {
            const dateA = parse(a.date, "dd/MM/yyyy, HH:mm:ss", new Date());
            const dateB = parse(b.date, "dd/MM/yyyy, HH:mm:ss", new Date());
            return dateA - dateB;
        });

        // Establecer los mensajes ordenados en privateChats
        setPrivateChats(allMessages);
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
};



    const connect = () => {
        let Sock = new SockJS(`${API_BASE_URL}/ws`);
        stompClient = over(Sock);
        stompClient.connect({ sender: userData.senderId, receiver: userData.receiverId }, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, connected: true });
        stompClient.subscribe('/user/' + userData.senderId + '/private', onPrivateMessage);
        userJoin();
    }

    const userJoin = () => {
        var chatMessage = {
            senderId: userData.senderId,
            receiverId: userData.receiverId,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }
    
    const onPrivateMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        const receivedMessage = {
            senderId: payloadData.senderId,
            message: payloadData.message,
            date: new Date().toLocaleString() // Formatear la fecha actual
        };
    
        setPrivateChats(prevPrivateChats => [...prevPrivateChats, receivedMessage]);
    }

    const onError = (err) => {
        console.log(err);
    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
    }

    const sendPrivateValue = () => {
        if (stompClient && userData.message.trim() !== "") {


            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleString(); 
        

            var chatMessage = {
                senderId: userData.senderId,
                receiverId: userData.receiverId,
                message: userData.message,
                date: formattedDate , 
                status: "MESSAGE"
            };
            
            setUserData({ ...userData, "message": "" });
            
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            
            setPrivateChats(prevPrivateChats => [...prevPrivateChats, chatMessage]);
        }
    }
  

    const handleSenderId = (event) => {
        const { value } = event.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            senderId: value
        }));
    }

    const handleReceiverId = (event) => {
        const { value } = event.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            receiverId: value
        }));
    }

    return (
        <div className="chat-room">
            {userData.connected ? (
                <div className="chat-container">
                    <div className="chat-header">
                        Chat with {userData.receiverId}
                    </div>
                    <div className="chat-messages">
                        {privateChats.map((message, index) => (
                            <div key={index} className={message.senderId === userData.senderId ? "sent-message" : "received-message"}>
                                {message.senderId} at {message.date}: {message.message}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={userData.message}
                            onChange={handleMessage}
                            placeholder="Type your message here..."
                        />
                        <button onClick={sendPrivateValue}>Send</button>
                    </div>
                </div>
            ) : (
                <div className="register">
                    <input
                        id="user-id"
                        placeholder="Enter your ID"
                        name="userId"
                        value={userData.senderId}
                        onChange={handleSenderId}
                        margin="normal"
                    />
                    <input
                        id="receiver-id"
                        placeholder="Enter receiver's ID"
                        name="receiverId"
                        value={userData.receiverId}
                        onChange={handleReceiverId}
                        margin="normal"
                    />
                    <button type="button" onClick={connect}>Connect</button> 
                </div>
            )}
        </div>
    );
}

export default ChatRoom;
