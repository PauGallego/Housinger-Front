import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from "sockjs-client/dist/sockjs";
//URL GLOABAL AÑADIR SIEMPRE
import { API_BASE_URL } from '../../astro.config.js';

var stompClient = null;

const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        senderId: '',
        receiverId: '',
        connected: false,
        message: ''
    });

    useEffect(() => {
      console.log(userData);
    }, [userData]);

    const connect = () => {
        let Sock = new SockJS(`${API_BASE_URL}/ws`);
        stompClient = over(Sock);
        stompClient.connect({sender: userData.senderId, receiver: userData.receiverId}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData, "connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.senderId+'/private', onPrivateMessage);
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

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderId)) {
                    privateChats.set(payloadData.senderId,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }
    
    const onPrivateMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderId)) {
            privateChats.get(payloadData.senderId).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderId, list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
    }

    const handleMessage = (event) => {
        const {value} = event.target;
        setUserData({...userData, "message": value});
    }

    const sendValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderId: userData.senderId,
                receiverId: userData.receiverId,
                message: userData.message,
                status: "MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData, "message": ""});
        }
    }
    const sendPrivateValue = () => {
        if (stompClient && tab !== "CHATROOM") {
         
            var chatMessage = {
                senderId: userData.senderId,
                receiverId: userData.receiverId,
                message: userData.message,
                status: "MESSAGE"
            };
            
            // Actualiza la lista de chats privados solo si el destinatario no es el remitente
            if (userData.senderId !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            
            // Envía el mensaje privado al servidor
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
                setUserData({...userData, "message": ""});
          
        }
    }
    

    const handleSenderId = (event) => {
        const {value} = event.target;
        setUserData({...userData, "senderId": value});
    }

    const handleReceiverId = (event) => {
        const {value} = event.target;
        setUserData({...userData, "receiverId": value});
    }

    const registerUser = () => {
        console.log(userData);
        connect();
    }

    return (
        <div className="container">
            {userData.connected ? (
                <div className="chat-box">
                    <div className="member-list">
                        <ul>
                            <li onClick={() => setTab("CHATROOM")} className={`member ${tab === "CHATROOM" && "active"}`}>Chatroom</li>
                            {[...privateChats.keys()].map((id, index) => (
                                <li onClick={() => setTab(id)} className={`member ${tab === id && "active"}`} key={index}>{id}</li>
                            ))}
                        </ul>
                    </div>
                    {tab === "CHATROOM" && (
                        <div className="chat-content">
                            <ul className="chat-messages">
                                {publicChats.map((chat, index) => (
                                    <li className={`message ${chat.senderId === userData.senderId && "self"}`} key={index}>
                                        {chat.senderId !== userData.senderId && <div className="avatar">{chat.senderId}</div>}
                                        <div className="message-data">{chat.message}</div>
                                        {chat.senderId === userData.senderId && <div className="avatar self">{chat.senderId}</div>}
                                    </li>
                                ))}
                            </ul>

                            <div className="send-message">
                                <input type="text" className="input-message" placeholder="Enter the message" value={userData.message} onChange={handleMessage} /> 
                                <button type="button" className="send-button" onClick={sendValue}>Send</button>
                            </div>
                        </div>
                    )}
                    {tab !== "CHATROOM" && (
                        <div className="chat-content">
                            <ul className="chat-messages">
                                {[...privateChats.get(tab)].map((chat, index) => (
                                    <li className={`message ${chat.senderId === userData.senderId && "self"}`} key={index}>
                                        {chat.senderId !== userData.senderId && <div className="avatar">{chat.senderId}</div>}
                                        <div className="message-data">{chat.message}</div>
                                        {chat.senderId === userData.senderId && <div className="avatar self">{chat.senderId}</div>}
                                    </li>
                                ))}
                            </ul>

                            <div className="send-message">
                                <input type="text" className="input-message" placeholder="Enter the message" value={userData.message} onChange={handleMessage} /> 
                                <button type="button" className="send-button" onClick={sendPrivateValue}>Send</button>
                            </div>
                        </div>
                    )}
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
                    <button type="button" onClick={registerUser}>Connect</button> 
                </div>
            )}
               <style>{`
              
              body {
                margin: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                  sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              
              code {
                font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
                  monospace;
              }
              
              input {
                padding: 10px;
                font-size: 1.2em;
              }
              button{
                border: none;
                padding: 10px;
                background: green;
                color:#fff;
                font-size: 1.2em;
                font-weight: bold;
              }
              
              
              .container{
                position: relative;
              }
              
              .register{
                position: fixed;
                padding:30px;
                box-shadow:0 2.8px 2.2px rgba(0, 0, 0, 0.034),0 6.7px 5.3px rgba(0, 0, 0, 0.048),0 12.5px 10px rgba(0, 0, 0, 0.06),0 22.3px 17.9px rgba(0, 0, 0, 0.072),0 41.8px 33.4px rgba(0, 0, 0, 0.086),0 100px 80px rgba(0, 0, 0, 0.12);
                top:35%;
                left:32%;
                display: flex;
                flex-direction: row;
              }
              .chat-box{
                box-shadow:0 2.8px 2.2px rgba(0, 0, 0, 0.034),0 6.7px 5.3px rgba(0, 0, 0, 0.048),0 12.5px 10px rgba(0, 0, 0, 0.06),0 22.3px 17.9px rgba(0, 0, 0, 0.072),0 41.8px 33.4px rgba(0, 0, 0, 0.086),0 100px 80px rgba(0, 0, 0, 0.12);
                margin:40px 50px;
                height: 600px;
                padding: 10px;
                display: flex;
                flex-direction: row;
              }
              
              .member-list{
                width: 20%;
              }
              
              .chat-content{
                width:80%;
                margin-left: 10px;
              }
              
              .chat-messages{
                height: 80%;
                border: 1px solid #000;
              }
              
              .send-message{
                width: 100%;
                display: flex;
                flex-direction: row;
              }
              
              .input-message{
                width:90%;
                border-radius: 50px;
              }
              
              ul {
                padding: 0;
                list-style-type: none;
              }
              .send-button{
                width:10%;
                border-radius: 50px;
                margin-left: 5px;
                cursor: pointer;
              }
              .member{
                padding: 10px;
                background: #eee;
                border:#000;
                cursor: pointer;
                margin: 5px 2px;
                box-shadow: 0 8px 8px -4px lightblue;
              }
              .member.active{
                background: blueviolet;
                color:#fff;
              }
              .member:hover{
                background: grey;
                color:#fff;
              }
              
              .avatar{
                background-color: cornflowerblue;
                padding: 3px 5px;
                border-radius: 5px;
                color:#fff;
              }
              .avatar.self{
                color:#000;
                background-color: greenyellow;
              }
              .message{
                padding:5px;
                width: auto;
                display: flex;
                flex-direction: row;
                box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
                margin: 5px 10px;
              }
              .message-data{
                padding:5px;
              }
              .message.self{
                justify-content: end;
              }
           
            `}</style>
        </div>
    );
}

export default ChatRoom;
