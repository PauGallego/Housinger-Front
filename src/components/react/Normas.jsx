import React, { useState, useEffect } from 'react';
import { Modal } from '@mui/material';
import './Styles/Normas.css';

const NormasComponent = ({ normas: propsNormas, userId, seguridad: propsSeguridad }) => {
    const [normasState, setNormasState] = useState(propsNormas || []);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [seguridad, setSeguridad] = useState(propsSeguridad || []);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId2, setUserId2] = useState(null);

    useEffect(() => {
        setIsAdmin(localStorage.getItem("admin") == "true");

        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        setUserId2(userData.userId || null);
    }, []);

    useEffect(() => {
        setNormasState(propsNormas || []);
        setSeguridad(propsSeguridad || []);
    }, [propsNormas, propsSeguridad]);

    useEffect(() => {
        localStorage.setItem('normas', JSON.stringify(normasState));
    }, [normasState]);

    useEffect(() => {
        localStorage.setItem('seguridad', JSON.stringify(seguridad));
    }, [seguridad]);

    const abrirModal = () => {
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
    };

    const agregarNorma = () => {
        const normaInput = document.getElementById('nuevaNormaInput');
        const nuevaNorma = normaInput.value.trim();
        if (nuevaNorma !== '') {
            setNormasState([...normasState, nuevaNorma]);
            normaInput.value = '';
        }
    };

    const borrarNorma = (index) => {
        const newNormas = [...normasState];
        newNormas.splice(index, 1);
        setNormasState(newNormas);
    };

    const toggleSeguridad = (item) => {
        if (userId === userId2 || isAdmin) {
            const updatedSeguridad = seguridad.includes(item)
                ? seguridad.filter((seg) => seg !== item)
                : [...seguridad, item];
            setSeguridad(updatedSeguridad);
        }
    };

    return (
        <div className="pl-10 md:pl-0 lg:mr-[200px] gap-20 propitario mt-20 flex flex-col lg:flex-row items-center lg:items-start">
            <div className="w-full lg:w-auto items-center flex flex-col">
                <h2 className="font-bold text-lg mt-5 text-center lg:text-left">Normas de la casa</h2>
                <div id="container" className="flex flex-col items-center lg:items-start w-full">
                    {normasState.map((norma, index) => (
                        <div key={index} className="normaContainer flex items-center justify-center lg:justify-start w-full mt-2">
                            <input type="text" className="normaText ajustar text-center lg:text-left w-full lg:w-auto" value={norma} readOnly />
                            {(userId === userId2 || isAdmin) && (
                                <button className="borrarNorma ml-2" onClick={() => borrarNorma(index)}>X</button>
                            )}
                        </div>
                    ))}
                </div>
                {(userId === userId2 || isAdmin) && (
                    <div className="flex flex-col items-start lg:items-start mt-4 w-[230px] mr-[25px]" >
                        <input type="text" id="nuevaNormaInput" className="normaText ajustar text-center  lg:text-left w-full lg:w-auto" placeholder="Escribe la norma" />
                        <button className="botonNorma mt-5 w-[150px]" onClick={agregarNorma}>Añadir norma</button>
                    </div>
                )}
            </div>
    
            <div className="w-full lg:w-auto flex flex-col items-center lg:items-start mt-10 lg:mt-0">
                <h2 className="font-bold text-lg mt-5 text-center lg:text-left">Seguridad en el hogar</h2>
                <div id="seguridadContainer" className="flex flex-col items-center lg:items-start w-full">
                    {[
                        { id: "alarma", label: "Alarma" },
                        { id: "camaras", label: "Cámaras de seguridad" },
                        { id: "cerco", label: "Cerco eléctrico" },
                        { id: "luces", label: "Luces de movimiento" },
                        { id: "rejas", label: "Rejas en ventanas" },
                        { id: "sensores", label: "Sensores de movimiento" },
                        { id: "vigilancia", label: "Vigilancia 24/7" },
                    ].map((item) => (
                        <div key={item.id} className="flex items-center mt-2">
                            <input type="checkbox" id={item.id} checked={seguridad.includes(item.id)} onChange={() => toggleSeguridad(item.id)} />
                            <label className='ml-2' htmlFor={item.id}>{item.label}</label>
                        </div>
                    ))}
                </div>
            </div>
    
            <div className="w-full lg:w-auto flex flex-col items-center lg:items-start mt-10 lg:mt-0">
                <h2 className="font-bold text-lg mt-5 text-center lg:text-left">Políticas de intercambio de casa</h2>
                <p className="politica text-center lg:text-left">
                    Ofrecemos una política de cancelación completa del anfitrión en Housinger. Cancela tu intercambio sin penalización por cualquier imprevisto.
                    Para saber más información, haz clic en el botón "Mostrar más" para conocer nuestras políticas de intercambio.
                </p>
                <button className="botones-propiedad text-white p-2 rounded-[5px] w-[200px] lg:w-[200px] mt-[20px]" onClick={abrirModal}>Mostrar más</button>
                <Modal
                    open={modalAbierto}
                    onClose={cerrarModal}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="modal-box bg-[white]">
                        <h3 className="font-bold text-lg text-black">Políticas de intercambio de casa</h3>
                        <p className="py-4">
                            En Housinger, entendemos que los planes pueden cambiar en cualquier momento debido a circunstancias imprevistas.
                            Es por eso que ofrecemos una política de cancelación completa del anfitrión. Ya sea que surja un compromiso repentino,
                            un cambio en tus planes de viaje o cualquier otro imprevisto, puedes cancelar tu intercambio sin penalización alguna.
                            Nuestra prioridad es brindarte flexibilidad y tranquilidad durante tu experiencia de intercambio en Housinger.
                            Queremos que te sientas seguro al reservar con nosotros, sabiendo que estamos aquí para respaldarte en caso de que necesites realizar cambios en tu reserva.
                        </p>
                        <div className="modal-action">
                            <button className="btn boton-cama" onClick={cerrarModal}>Cerrar</button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
        
};

export default NormasComponent;
