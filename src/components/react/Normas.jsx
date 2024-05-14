import React, { useState, useEffect } from 'react';
import { Modal } from '@mui/material';
import './Styles/Normas.css';

const NormasComponent = ({ normas: propsNormas, userId, seguridad: propsSeguridad }) => {
    const [normasState, setNormasState] = useState(propsNormas || []);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [seguridad, setSeguridad] = useState(propsSeguridad || []);

    useEffect(() => {
        setNormasState(propsNormas || []);
        setSeguridad(propsSeguridad || []);
    }, [propsNormas, propsSeguridad]);

    let userData = JSON.parse(localStorage.getItem('userData'));

    // Verifica si userData es null y asigna un array vacío en ese caso
    if (userData === null) {
        userData = [];
    }
    
    const userId2 = userData.userId;
    useEffect(() => {
        // Guardar las normas en localStorage
        localStorage.setItem('normas', JSON.stringify(normasState));
    }, [normasState]);

    useEffect(() => {
        // Guardar la seguridad en localStorage
        localStorage.setItem('seguridad', JSON.stringify(seguridad));
    }, [seguridad]);

    const abrirModal = () => {
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
    };

    // Función para agregar una nueva norma
    const agregarNorma = () => {
        const normaInput = document.getElementById('nuevaNormaInput');
        const nuevaNorma = normaInput.value.trim();
        if (nuevaNorma !== '') {
            setNormasState([...normasState, nuevaNorma]);
            normaInput.value = '';
        }
    };

    // Función para eliminar una norma
    const borrarNorma = (index) => {
        const newNormas = [...normasState];
        newNormas.splice(index, 1);
        setNormasState(newNormas);
    };

    // Función para gestionar seguridad
    const toggleSeguridad = (item) => {
        if (userId === userId2) {
            const updatedSeguridad = seguridad.includes(item)
                ? seguridad.filter((seg) => seg !== item)
                : [...seguridad, item];
            setSeguridad(updatedSeguridad);
        }
    };

    return (
        <div className="lg:flex lg:ml-[200px] ajustar gap-20">
            <div>
                <h2 className="font-bold text-lg mt-5">Normas de la casa</h2>
                <div id="container">
                    {normasState.map((norma, index) => (
                        <div key={index} className="normaContainer">
                            <input type="text" className="normaText ajustar" value={norma} readOnly />
                            {userId == userId2 && (
                                <button className="borrarNorma" onClick={() => borrarNorma(index)}>X</button>
                            )}
                        </div>
                    ))}
                </div>
                {userId == userId2 && (
                    <>
                        <input type="text" id="nuevaNormaInput" className="normaText ajustar" placeholder="Escribe la norma" />
                        <button className="botonNorma" onClick={agregarNorma}>Añadir norma</button>
                    </>
                )}
            </div>

            <div>
                <h2 className="font-bold text-lg mt-5">Seguridad en el hogar</h2>
                <div id="seguridadContainer">
                    <input type="checkbox" id="alarma" checked={seguridad.includes('1')} onChange={() => toggleSeguridad('1')} /><label htmlFor="alarma">Alarma</label><br />
                    <input type="checkbox" id="camaras" checked={seguridad.includes('2')} onChange={() => toggleSeguridad('2')} /><label htmlFor="camaras">Cámaras de seguridad</label><br />
                    <input type="checkbox" id="cerco" checked={seguridad.includes('3')} onChange={() => toggleSeguridad('3')} /><label htmlFor="cerco">Cerco eléctrico</label><br />
                    <input type="checkbox" id="luces" checked={seguridad.includes('4')} onChange={() => toggleSeguridad('4')} /><label htmlFor="luces">Luces de movimiento</label><br />
                    <input type="checkbox" id="rejas" checked={seguridad.includes('5')} onChange={() => toggleSeguridad('5')} /><label htmlFor="rejas">Rejas en ventanas</label><br />
                    <input type="checkbox" id="sensores" checked={seguridad.includes('6')} onChange={() => toggleSeguridad('6')} /><label htmlFor="sensores">Sensores de movimiento</label><br />
                    <input type="checkbox" id="vigilancia" checked={seguridad.includes('7')} onChange={() => toggleSeguridad('7')} /><label htmlFor="vigilancia">Vigilancia 24/7</label><br />
                </div>
            </div>

            <div>
                <h2 className="font-bold text-lg mt-5">Políticas de intercambio de casa</h2>
                <p className="politica">Ofrecemos una política de cancelación completa del anfitrión en Housinger. Cancela tu intercambio sin penalización por cualquier imprevisto. Para saber más información, haz clic en el botón "Mostrar más" para conocer nuestras políticas de intercambio.</p>
                <button className="botones-propiedad text-white p-2 rounded-[5px] w-[200px] lg:w-40 md:w-[200px] mt-[20px]" onClick={abrirModal}>Mostrar más</button>
                <Modal
                    open={modalAbierto}
                    onClose={cerrarModal}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Políticas de intercambio de casa</h3>
                        <p className="py-4">En Housinger, entendemos que los planes pueden cambiar en cualquier momento debido a circunstancias imprevistas. Es por eso que ofrecemos una política de cancelación completa del anfitrión. Ya sea que surja un compromiso repentino, un cambio en tus planes de viaje o cualquier otro imprevisto, puedes cancelar tu intercambio sin penalización alguna. Nuestra prioridad es brindarte flexibilidad y tranquilidad durante tu experiencia de intercambio en Housinger. Queremos que te sientas seguro al reservar con nosotros, sabiendo que estamos aquí para respaldarte en caso de que necesites realizar cambios en tu reserva.</p>
                        <div className="modal-action">
                            <button className="btn" onClick={cerrarModal}>Cerrar</button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default NormasComponent;
