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
    const userId2 = userData.userId;

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
                <input type="checkbox" id="alarma" checked={seguridad.includes('1')} onChange={() => { if (userId === userId2) { const updatedSeguridad = seguridad.includes('1') ? seguridad.filter(item => item !== '1') : [...seguridad, '1']; setSeguridad(updatedSeguridad); } }} /><label htmlFor="alarma">Alarma</label><br />
                <input type="checkbox" id="camaras" checked={seguridad.includes('2')} onChange={() => { if (userId === userId2) { const updatedSeguridad = seguridad.includes('2') ? seguridad.filter(item => item !== '2') : [...seguridad, '2']; setSeguridad(updatedSeguridad); } }} /><label htmlFor="camaras">Cámaras de seguridad</label><br />
                <input type="checkbox" id="cerco" checked={seguridad.includes('3')} onChange={() => { if (userId === userId2) { const updatedSeguridad = seguridad.includes('3') ? seguridad.filter(item => item !== '3') : [...seguridad, '3']; setSeguridad(updatedSeguridad); } }} /><label htmlFor="cerco">Cerco eléctrico</label><br />
                <input type="checkbox" id="luces" checked={seguridad.includes('4')} onChange={() => { if (userId === userId2) { const updatedSeguridad = seguridad.includes('4') ? seguridad.filter(item => item !== '4') : [...seguridad, '4']; setSeguridad(updatedSeguridad); } }} /><label htmlFor="luces">Luces de movimiento</label><br />
                <input type="checkbox" id="rejas" checked={seguridad.includes('5')} onChange={() => { if (userId === userId2) { const updatedSeguridad = seguridad.includes('5') ? seguridad.filter(item => item !== '5') : [...seguridad, '5']; setSeguridad(updatedSeguridad); } }} /><label htmlFor="rejas">Rejas en ventanas</label><br />
                <input type="checkbox" id="sensores" checked={seguridad.includes('6')} onChange={() => { if (userId === userId2) { const updatedSeguridad = seguridad.includes('6') ? seguridad.filter(item => item !== '6') : [...seguridad, '6']; setSeguridad(updatedSeguridad); } }} /><label htmlFor="sensores">Sensores de movimiento</label><br />
                <input type="checkbox" id="vigilancia" checked={seguridad.includes('7')} onChange={() => { if (userId === userId2) { const updatedSeguridad = seguridad.includes('7') ? seguridad.filter(item => item !== '7') : [...seguridad, '7']; setSeguridad(updatedSeguridad); } }} /><label htmlFor="vigilancia">Vigilancia 24/7</label><br />


                </div>
            </div>


            <div>
                <h2 className="font-bold text-lg mt-5">Políticas de intercambio de casa</h2>
                <p className="politica">Ofrecemos una política de cancelación completa del anfitrión en Housinger. Cancela tu intercambio sin penalización por cualquier imprevisto. Para saber más información, haz clic en el botón "Mostrar más" para conocer nuestras políticas de intercambio.</p>
                <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px] mt-[20px]" onClick={abrirModal}>Mostrar más</button>
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
