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
    const [customerData, setCustomerData] = useState({
        senderName: '',
        senderId: '',
        receiverName: '',
        receiverId: '',
        senderSurname: '',
        receiverSurname: '',
        senderFoto: '',
        receiverFoto: ''
    });

    const [receiverButtons, setReceiverButtons] = useState(null);
    const [loadedConversations, setLoadedConversations] = useState([]);

    useEffect(() => {
        if (userData.receiverId && userData.senderId && userData.connected) {
            fetchCustomerData(); 
        }
    }, [userData.receiverId, userData.senderId, userData.connected]);
    
    useEffect(() => {
        if (customerData.receiverId && customerData.senderId) {
            fetchData(); 
        }
    }, [customerData.receiverId, customerData.senderId]);
    
    

    const fetchCustomerData = async () => {
        try {
            const response1 = await fetch(`${API_BASE_URL}/v1/customer/get/${userData.receiverId}`);
            const data1 = await response1.json();
    
            const response2 = await fetch(`${API_BASE_URL}/v1/customer/get/${userData.senderId}`);
            const data2 = await response2.json();
    
            setCustomerData({
                receiverName: data1.name,
                receiverSurname: data1.surname,
                receiverFoto: data1.picture,
                senderName: data2.name,
                senderSurname: data2.surname,
                senderFoto: data2.picture,
                receiverId: userData.receiverId,
                senderId: userData.senderId
            });

        } catch (error) {
            console.error('Error loading customer data:', error);
        }
    };
    
   const fetchData = async () => {
        try {
            await fetchCustomerData(); 

            const response2 = await fetch(`${API_BASE_URL}/v1/chat/getSent/${userData.senderId}`);
            const data2 = await response2.json();
            
            const uniqueReceiverIds = [...new Set(data2.map(message => message.receiverId))];

            const isCurrentReceiverLoaded = loadedConversations.includes(userData.receiverId);

            let buttons = uniqueReceiverIds.map(receiverId => (
                <button key={receiverId} onClick={() => handleReceiverChange(receiverId)}>
                    Chat with {receiverId}
                </button>
            ));

            if (!isCurrentReceiverLoaded && !uniqueReceiverIds.includes(userData.receiverId)) {
                buttons.push(
                    <button key={`currentReceiver_${userData.receiverId}`} onClick={() => handleReceiverChange(userData.receiverId)}>
                        Chat with {userData.receiverId}
                    </button>
                );
            }

            buttons = buttons.filter((button, index) => {
                return buttons.findIndex(btn => btn.key === button.key) === index;
            });

            setReceiverButtons(buttons);

        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };


    const loadChatHistory = async (senderId, receiverId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/chat/getChat/${senderId}/${receiverId}`);
            const data = await response.json();
    
            data.sort((a, b) => {
                const dateA = parse(a.date, "dd/MM/yyyy, HH:mm:ss", new Date());
                const dateB = parse(b.date, "dd/MM/yyyy, HH:mm:ss", new Date());
                return dateA - dateB;
            });

    
            setPrivateChats(data);
    
            if (!loadedConversations.includes(receiverId)) {
                setLoadedConversations(prevConversations => [...prevConversations, receiverId]);
            }
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
            senderName: payloadData.senderName,
            senderSurname: payloadData.senderSurname,
            receiverName: payloadData.receiverName,
            receiverSurname: payloadData.receiverSurname,
            message: payloadData.message,
            date: new Date().toLocaleString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
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
            const formattedDate = currentDate.toLocaleString('es-ES'); 
            var chatMessage = {
                senderId: userData.senderId,
                receiverId: userData.receiverId,
                senderName: customerData.senderName,
                senderSurname: customerData.senderSurname,
                receiverName: customerData.receiverName,
                receiverSurname: customerData.receiverSurname,
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
            connect();
        }
    };

    const handleReceiverChange = (receiverId) => {
        setUserData(prevUserData => ({
            ...prevUserData,
            receiverId: receiverId
        }));
        loadChatHistory(userData.senderId, receiverId); 
    
        setPrivateChats([]);
    };
    
    return (
        <div className="chat-room">
            {userData.connected ? (
                <div className="chat-container">
                    <div className="chat-header">
                        Chat with {customerData.receiverName} {customerData.receiverSurname}
                    </div>
                    <div className="chat-messages">
                        {privateChats.map((message, index) => (
                            <div key={index} className={message.senderId === userData.senderId ? "sent-message" : "received-message"}>
                                <span>{message.senderName} {message.senderSurname}</span> at {message.date}: {message.message}
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
