import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from "sockjs-client/dist/sockjs";
import { API_BASE_URL } from '../../astro.config.js';
import './ChatRoom.css';
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
    const [connecting, setConnecting] = useState(false); // State to track connection intent

    useEffect(() => {
        if (userData.receiverId && userData.senderId && connecting) {
            connect();
            fetchData(); // Load chat history when senderId, receiverId, and connecting state are set
        }
    }, [userData.receiverId, userData.senderId, connecting]);

   // Función para cargar el historial de chat
    const fetchData = async () => {
        try {
            // Obtener mensajes enviados y recibidos entre dos usuarios
            const response = await fetch(`${API_BASE_URL}/v1/chat/getChat/${userData.senderId}/${userData.receiverId}`);
            const data = await response.json();

            // Ordenar los mensajes por fecha utilizando date-fns parse
            data.sort((a, b) => {
                const dateA = parse(a.date, "dd/MM/yyyy, HH:mm:ss", new Date());
                const dateB = parse(b.date, "dd/MM/yyyy, HH:mm:ss", new Date());
                return dateA - dateB;
            });

            // Establecer los mensajes ordenados en privateChats
            setPrivateChats(data);
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };


    const connect = () => {
        let Sock = new SockJS(`${API_BASE_URL}/ws`);
        stompClient = over(Sock);
        stompClient.connect({ sender: userData.senderId, receiver: userData.receiverId }, onConnected, onError);
    };

    const onConnected = () => {
        setUserData({ ...userData, connected: true });
        stompClient.subscribe('/user/' + userData.senderId + '/private', onPrivateMessage);
        userJoin();
    };

    const userJoin = () => {
        var chatMessage = {
            senderId: userData.senderId,
            receiverId: userData.receiverId,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    };
    
    const onPrivateMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        const receivedMessage = {
            senderId: payloadData.senderId,
            message: payloadData.message,
            date: new Date().toLocaleString() // Formatear la fecha actual
        };
    
        setPrivateChats(prevPrivateChats => [...prevPrivateChats, receivedMessage]);
    };

    const onError = (err) => {
        console.log(err);
    };

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
    };

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
    };
  
    const handleSenderId = (event) => {
        const { value } = event.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            senderId: value
        }));
    };

    const handleReceiverId = (event) => {
        const { value } = event.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            receiverId: value
        }));
    };

    const handleConnectClick = () => {
        setConnecting(true); // Set connecting state to true when the connect button is clicked
    };

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
                    <button type="button" onClick={handleConnectClick}>Connect</button> 
                </div>
            )}
        </div>
    );
};

export default ChatRoom;
