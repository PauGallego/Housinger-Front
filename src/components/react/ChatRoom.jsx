import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from "sockjs-client/dist/sockjs";
import { API_BASE_URL } from '../../astro.config.js';
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
    const [receiverButtons, setReceiverButtons] = useState(null); // State to hold receiver buttons
    const [loadedConversations, setLoadedConversations] = useState([]); // State to keep track of loaded conversations

    useEffect(() => {
        if (userData.receiverId && userData.senderId && userData.connected) {
            fetchData(); // Load chat history when senderId, receiverId, and connected state are set
        }
    }, [userData.receiverId, userData.senderId, userData.connected]);

    // Función para cargar el historial de chat
    const fetchData = async () => {
        try {
            // Obtener mensajes enviados por el usuario para recuperar cuantas receiver ids diferentes obtenemos para hacer botones con cada una de las conversaciones previas
            const response2 = await fetch(`${API_BASE_URL}/v1/chat/getSent/${userData.senderId}`);
            const data2 = await response2.json();
            
            // Obtener las IDs únicas de los receptores de los mensajes enviados por el usuario
            const uniqueReceiverIds = [...new Set(data2.map(message => message.receiverId))];

            // Crear botones para cada receptor
            const buttons = uniqueReceiverIds.map(receiverId => (
                <button key={receiverId} onClick={() => handleReceiverChange(receiverId)}>
                    Chat with {receiverId}
                </button>
            ));

            // Establecer los botones en el estado
            setReceiverButtons(buttons);
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    // Función para cargar el historial de chat entre el usuario actual y un receptor específico
    const loadChatHistory = async (senderId, receiverId) => {
        try {
            // Verificar si esta conversación ya ha sido cargada previamente
            if (loadedConversations.includes(receiverId)) {
                return;
            }

            const response = await fetch(`${API_BASE_URL}/v1/chat/getChat/${senderId}/${receiverId}`);
            const data = await response.json();

            // Ordenar los mensajes por fecha utilizando date-fns parse
            data.sort((a, b) => {
                const dateA = parse(a.date, "dd/MM/yyyy, HH:mm:ss", new Date());
                const dateB = parse(b.date, "dd/MM/yyyy, HH:mm:ss", new Date());
                return dateA - dateB;
            });

            // Establecer los mensajes ordenados en privateChats
            setPrivateChats(data);

            // Agregar el receptorId a las conversaciones cargadas
            setLoadedConversations(prevConversations => [...prevConversations, receiverId]);
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
        if(userData.receiverId) {
            handleReceiverChange(userData.receiverId); 
        }
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
        if (userData.senderId && userData.receiverId) {
            connect(); // Connect only if senderId and receiverId are set
        }
    };

    const handleReceiverChange = (receiverId) => {
        setUserData(prevUserData => ({
            ...prevUserData,
            receiverId: receiverId
        }));
        loadChatHistory(userData.senderId, receiverId); 
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
                    <div className="conversation-buttons">
                        {receiverButtons}
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
