import React, { useEffect, useState , useRef} from 'react';
import { over } from 'stompjs';
import SockJS from "sockjs-client/dist/sockjs";
import { API_BASE_URL } from '../../astro.config.js';
import { API_BASE_URL2 } from '../../astro.config.js';
import { parse, set } from 'date-fns';
import './Styles/ChatRoom.css';
import { Modal, Button, TextField } from '@mui/material';
import Calendar from './Calendario.jsx';
import Calendar2 from './CalendarioSelec.jsx'
import Calendar3 from './CalendarioSelec2.jsx'


var stompClient = null;
var subscription = null; 


const ChatRoom = ({ senderId, receiverId }) => {
    const [privateChats, setPrivateChats] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [showModal7, setShowModal7] = useState(false);
    const [propId, setPropId] = useState(false);
    const [propiedades, setPropiedades] = useState([]);
    const [userData, setUserData] = useState({
        senderId: senderId,
        receiverId: receiverId,
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


    const openModal = (id) =>{
        setShowModal3(false);
        setPropId(id);

        setShowModal(true);
    }

    const closeModal = () =>{
        setShowModal(false);
    }

    const openModal7 = (id) =>{
        setShowModal7(true);
    }

    const closeModal7 = () =>{
        setShowModal7(false);
    }
    
    const openModal2 = () =>{
        setShowModal2(true);
    }

    const closeModal2 = () =>{
        setShowModal2(false);
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

    
            const response = await fetch(`${API_BASE_URL}/v1/reservation/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Authentication ' + localStorage.getItem('authorization')
                },
                body: JSON.stringify(reservationData)
            });
    
            if (response.ok) {
                console.log('Reserva realizada con éxito.');

                const updatedUrl = new URL(window.location.href);
                updatedUrl.searchParams.set('receiver', userData.receiverId); 
                window.history.pushState({}, '', updatedUrl);

                loadChatHistory(userData.senderId, userData.receiverId);
                closeModal2();
            } else {
           
                console.error('Error al realizar la reserva:', response.statusText);
            }
        } catch(error) {
           
            console.error('Error:', error);
        }
        
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
                const response = await fetch(`${API_BASE_URL}/v1/propertyUser/getCustomer/${userData.receiverId}`);
                const data = await response.json();
                setPropiedades(data);

                console.log(data);
            } catch (error) {
                console.error('Error fetching property data:', error);
            }
        };

            
        fetchData();
       
    }



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

    let token = localStorage.getItem('authorization');


    const fetchData = async () => {
        try {
            await fetchCustomerData();
    
            const responseSent = await fetch(`${API_BASE_URL}/v1/chat/getSent/${userData.senderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Authentication ' + token,
                }
            });
    
            const dataSent = await responseSent.json();
    
            const responseReceived = await fetch(`${API_BASE_URL}/v1/chat/getReceived/${userData.senderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Authentication ' + token,
                }
            });
    
            const dataReceived = await responseReceived.json();
    
            const filteredReceivedMessages = dataReceived.filter(message => message.senderId !== userData.senderId);
    
            const allMessages = [...dataSent, ...filteredReceivedMessages];
    
            const uniqueSenderIds = [...new Set(allMessages.map(message => message.senderId))];
    
            let buttons = [];
    
            const addedSenderIds = new Set();
    
            await Promise.all(uniqueSenderIds.map(async (senderId) => {
                if (senderId === userData.senderId) {
                    const messagesWithSender = allMessages.filter(message => message.senderId === senderId);
                    messagesWithSender.forEach(message => {
                        if (!addedSenderIds.has(message.receiverId)) {
                            buttons.push(
                                <button key={`${message.receiverId}`} onClick={() => handleReceiverChange(message.receiverId)} className='flex items-center w-[200px] boton-persona'>
                                    <img src={`${API_BASE_URL}/v1/fileCustomer/download/${message.receiverPicture}`} className="rounded-full w-10 h-10 m-[5px] " alt="Sender" />
                                    {message.receiverName} {message.receiverSurname}
                                </button>
                            );
                            addedSenderIds.add(message.receiverId);
                        }
                    });
                } else {
                    const messagesWithSender = allMessages.filter(message => message.senderId === senderId);
                    if (!addedSenderIds.has(senderId)) {
                        buttons.push(
                            <button key={senderId} onClick={() => handleReceiverChange(senderId)} className='flex items-center w-[200px] boton-persona'>
                                <img src={`${API_BASE_URL}/v1/fileCustomer/download/${messagesWithSender[0].senderPicture}`} className="rounded-full w-10 h-10 m-[5px] " alt="Sender" />
                                {messagesWithSender[0].senderName} {messagesWithSender[0].senderSurname}
                            </button>
                        );
                        addedSenderIds.add(senderId);
                    }
                }
            }));
    
            setReceiverButtons(buttons);
    
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };
    
    
    
    

    const loadChatHistory = async (senderId, receiverId) => {
        try {

            const response = await fetch(`${API_BASE_URL}/v1/chat/getChat/${senderId}/${receiverId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Authentication ' + token,
                }
            });

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
        if (!stompClient || !stompClient.connected) {
            let Sock = new SockJS(`${API_BASE_URL}/ws`);
            stompClient = over(Sock);
            stompClient.connect({ sender: userData.senderId, receiver: userData.receiverId }, onConnected, onError);
        } else {
            onConnected();
        }
    };
    

    const onConnected = () => {
        setUserData({ ...userData, connected: true });
    
        if (subscription) {
            subscription.unsubscribe();
        }
        
        subscription = stompClient.subscribe('/user/' + userData.senderId + '/private', onPrivateMessage);
        userJoin();
    
        if (userData.receiverId) {
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
        if (stompClient) {
            var payloadData = JSON.parse(payload.body);
    
            const receivedMessage = {
                senderId: payloadData.senderId,
                senderName: payloadData.senderName,
                senderSurname: payloadData.senderSurname,
                receiverName: payloadData.receiverName,
                receiverSurname: payloadData.receiverSurname,
                message: payloadData.message,
                senderFoto: payloadData.senderPicture,
                senderPicture: payloadData.senderPicture,
                date: payloadData.date
            };
    
            // Verificar si el mensaje ya existe para evitar duplicados
            const isDuplicate = privateChats.some(chat => 
                chat.senderId == receivedMessage.senderId &&
                chat.message == receivedMessage.message &&
                chat.date == receivedMessage.date
            );
    
            if (!isDuplicate) {
                let divuser = document.getElementById('iduser');
                if (divuser.value == receivedMessage.senderId) {
                    setPrivateChats(prevPrivateChats => [...prevPrivateChats, receivedMessage]);
                } else {
                    console.log("Mensaje de otro usuario " + receivedMessage.senderName + " " + receivedMessage.senderSurname);
                    fetchData();
                }
            }
        }
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
                date: formattedDate,
                senderPicture: customerData.senderFoto,
                status: "MESSAGE"
            };

            setUserData({ ...userData, "message": "" });

            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));

            setPrivateChats(prevPrivateChats => [...prevPrivateChats, chatMessage]);

            if (privateChats.length == 0) {
                fetchData();
            }
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

    useEffect(() => {
        if (senderId && receiverId) {
            connect();
        }
    }, [senderId, receiverId]);

    const chatContainerRef = useRef(null);

  // Scroll to the bottom of the chat container after initial render
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    const params = new URLSearchParams(window.location.search);
    const receiverParam = params.get('error');
    if(receiverParam){
        openModal7();
        params.delete('error');
        const newUrl = `${window.location.pathname}?${params.toString()}`;
         window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Scroll to the bottom of the chat container when privateChats change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [privateChats]);


      

    //Funcion para enviar mensaje con la tecla Enter
    const handleMessageKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendPrivateValue();
        }
    };

    return (
        <div className="chat-room  md:w-[80vw] m-auto  ">
            {userData.connected ? (

                <div  id='chat-container' className="chat-container w-[100vw] md:w-[80vw]   flex-col md:flex-col lg:flex-row gap-5 ">
                    <div className="conversation-buttons flex flex-row lg:flex-col w-[100vw] md:w-[80vw] lg:w-[17vw] flex-wrap min-h-[50px]">
                        {receiverButtons}
                    </div>

                    <div className="chat-messages flex flex-col bg-[#576cbc]  w-[100vw] md:w-[80vw] lg:w-[70vw]" ref={chatContainerRef}>
                        <div className="chat-header text-left " >

                            <p className='text-white  text-left'>Chat con {customerData.receiverName} {customerData.receiverSurname}</p>

                            <input type="hidden" id='iduser' value={customerData.receiverId} />
                        </div>

                        {privateChats.map((message, index) => (
                            <div key={index} className={message.senderId === userData.senderId ? "sent-message" : "received-message"}>
                                <div className="flex items-center">

                                    <img src={`${API_BASE_URL}/v1/fileCustomer/download/${message.senderPicture}`} className="rounded-full w-10 h-10 m-[5px]" alt="Sender" />
                                </div>
                                <div className="m-[5px] ajustar-texto">
                                    <p className="text-black " dangerouslySetInnerHTML={{ __html: message.message }}></p>
                                    <p className="text-xs text-black">{message.senderName}</p>
                                    <p className="text-xs text-black">{message.date}</p>
                                </div>
                            </div>
                            
                        ))}
                        <div className='mt-[60px] bp-[500px] md:mt-[100px] md:bm-[100px]'></div>

                        <div className="chat-input flex justify-center items-center w-[95vw] md:w-[78vw] lg:w-[62vw]  top-[880px] lg:top-[820px]">
                            <input className='w-[90%] h-[40px] rounded-[50px] input-enviar'
                                type="text"
                                value={userData.message}
                                onChange={handleMessage}
                                onKeyDown={handleMessageKeyDown}
                            />
                            <button onClick={sendPrivateValue} className='ml-[10px] mt-5 boton-enviar'>
                                <i className="icon-[material-symbols--send-rounded] logo-enviar"></i>
                            </button>
                            <button onClick={openModal3}  className='ml-[10px] mt-5 boton-enviar'>
                                <i className="icon-[mdi--home-switch-outline] logo-enviar"></i>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="loading-message ">
                    <p className='text-center text-white text-4xl'>Conectando...</p>
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
                            <button className="btn" onClick={closeModal3}>Cerrar</button>
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
                            <button className="btn" onClick={closeModal}>Cancelar</button>
                            <button className="btn" onClick={nextModal}>Siguiente</button>
                           
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
                        <h3 className="font-bold text-lg text-black">Dia de salida: </h3>
                            <p>Porfavor, selecciona las fechas deseadas</p>
                         <Calendar3 propid={propId} />
                        
                         <div className="modal-action flex  items-center">
                        <p className='text-[red] text-center' id='errorDiaSalida'></p>
                            <button className="btn" onClick={prevModal}>Anterior</button>
                            <button className="btn" onClick={fianlizarReserva}>Reservar</button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    open={showModal7}
                    onClose={closeModal7}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="modal-box bg-[white]">
                        <h3 className="font-bold text-lg text-black">No tienes permisos para ver eso</h3>
                            <p>No puedes ver esta propuesta..</p>
                 
                         <div className="modal-action flex  items-center">
    
                            <button className="btn" onClick={closeModal7}>Cerrar</button>
                        </div>
                    </div>
                </Modal>

                
        </div>
    );

};

export default ChatRoom;