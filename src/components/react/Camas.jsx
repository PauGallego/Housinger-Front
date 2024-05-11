import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { API_BASE_URL } from '../../astro.config';
import { Modal, Button } from '@mui/material'; 

const CamasComponent = ({ id, guardar }) => {
    const [camas, setCamas] = useState([]);
    const [tiposCama, setTiposCama] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);
    const [numberOfBeds, setNumberOfBeds] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/v1/bed/getByProperty/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCamas(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchData2 = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/v1/bedType/get/all`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTiposCama(data);

                console.log(data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        fetchData2();
    }, [id]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleBedSelection = (bed) => {
        setSelectedBed(bed);
    };

    const handleSave = () => {
        console.log('Cama seleccionada:', selectedBed);
        console.log('Número de camas:', numberOfBeds);
        closeModal();
    };

    return (
        <div className="contendor-camas mt-10 lg:ml-[230px]  ">
            <h2 className="font-bold text-lg texto-que-hay">¿Dónde dormimos?</h2>
            {camas.map(cama => (
                <div key={cama.id} className="flex items-center justify-center gap-5">
                    <div className="mt-5 flex items-center justify-center gap-2">
                        <Icon icon={cama.icon} className="h-[25px] w-[25px] mr-[10px]" />
                        <label className="mt-2">{`${cama.number} ${cama.type}`}</label>
                    </div>
                </div>
            ))}
            {guardar && (
                <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px] mt-[20px]" onClick={openModal}>Modificar</button>
            )}
            <Modal open={showModal} onClose={closeModal} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div className="modal-box">
                    <h2>Seleccionar cama y número</h2>
                    <div className="modal-content-container">
                        <div className="bed-list">
                            {tiposCama.map(tipoCama => {
                                const camaExistente = camas.find(cama => cama.type === tipoCama.name);
                                const cantidad = camaExistente ? camaExistente.number : 0;
                                return (
                                    <div key={tipoCama.id} className={`bed ${selectedBed && selectedBed.type === tipoCama.name ? 'selected' : ''}`} onClick={() => handleBedSelection(tipoCama)}>
                                        <Icon icon={tipoCama.icon} className="h-[25px] w-[25px] mr-[10px]" />
                                        <span>{` ${tipoCama.name}`}</span>
                                        <input
                                            type="number"
                                            value={numberOfBeds}
                                            onChange={(e) => {
                                                const newValue = parseInt(e.target.value);
                                                setNumberOfBeds(isNaN(newValue) ? '' : newValue);
                                            }}
                                            placeholder={cantidad === 0 ? '0' : cantidad.toString()}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="modal-action">
                        <button className="btn" onClick={handleSave}>Guardar</button>
                        <button className="btn" onClick={closeModal}>Cerrar</button>
                    </div>
                </div>
            </Modal>



        </div>
    );
};

export default CamasComponent;
