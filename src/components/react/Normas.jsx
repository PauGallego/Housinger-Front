import React, { useState } from 'react';
import { Modal } from '@mui/material';
import './Styles/Normas.css';

const NormasComponent = () => {
    const [normas, setNormas] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);

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
            setNormas([...normas, nuevaNorma]);
            normaInput.value = '';
        }
    };

    const borrarNorma = (index) => {
        const nuevasNormas = [...normas];
        nuevasNormas.splice(index, 1);
        setNormas(nuevasNormas);
    };

    return (
        <div className="lg:flex lg:ml-[200px] ajustar gap-20">
            <div>
                <h2 className="font-bold text-lg mt-5">Normas de la casa</h2>
                <div id="container">
                    {normas.map((norma, index) => (
                        <div key={index} className="normaContainer">
                            <input type="text" className="normaText ajustar" value={norma} readOnly />
                            <button className="borrarNorma" onClick={() => borrarNorma(index)}>X</button>
                        </div>
                    ))}
                </div>
                <input type="text" id="nuevaNormaInput" className="normaText ajustar" placeholder="Escribe la norma" />
                <button className="botonNorma" onClick={agregarNorma}>Añadir norma</button>
            </div>

            <div>
                <h2 className="font-bold text-lg mt-5">Seguridad en el hogar</h2>
                <div id="seguridadContainer">
                    <input type="checkbox" id="alarma" /><label htmlFor="alarma">Alarma</label><br />
                    <input type="checkbox" id="camaras" /><label htmlFor="camaras">Cámaras de seguridad</label><br />
                    <input type="checkbox" id="cerco" /><label htmlFor="cerco">Cerco eléctrico</label><br />
                    <input type="checkbox" id="luces" /><label htmlFor="luces">Luces de movimiento</label><br />
                    <input type="checkbox" id="rejas" /><label htmlFor="rejas">Rejas en ventanas</label><br />
                    <input type="checkbox" id="sensores" /><label htmlFor="sensores">Sensores de movimiento</label><br />
                    <input type="checkbox" id="vigilancia" /><label htmlFor="vigilancia">Vigilancia 24/7</label><br />
                </div>
            </div>

            <div>
                <h2 className="font-bold text-lg mt-5">Políticas de intercambio de casa</h2>
                <p className="politica">Ofrecemos una política de cancelación completa del anfitrión en Housinger. Cancela tu intercambio sin penalización por cualquier imprevisto. Para saber más información, haz clic en el botón "Mostrar más" para conocer nuestras políticas de intercambio.</p>
                <button className="boton-modal" onClick={abrirModal}>Mostrar más</button>
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
