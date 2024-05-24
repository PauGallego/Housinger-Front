import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { API_BASE_URL } from '../../astro.config';
import { Modal, Button } from '@mui/material'; 


const CamasComponent = ({ id, guardar }) => {
    const [camas, setCamas] = useState([]);
    const [tiposCama, setTiposCama] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);
    const [numberOfBeds, setNumberOfBeds] = useState({});
    const [camasModificadas, setCamasModificadas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/v1/bed/getByProperty/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCamas(data);

      

                const newDataFormat = data.map(cama => [cama.bedTypeId, cama.number]);
                
             
                setCamasModificadas(newDataFormat);

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
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        fetchData2();

 
    }, [id]);

    useEffect(() => {
        localStorage.setItem('camasModificadas', JSON.stringify(camasModificadas));
    }, [camasModificadas]);

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
        console.log('Camas seleccionadas:', numberOfBeds);
        const nuevasCamas = tiposCama.map(tipoCama => {
            const cantidad = numberOfBeds[tipoCama.name] || 0;
            const camaExistente = camas.find(cama => cama.type === tipoCama.name);
            const icon = camaExistente ? camaExistente.icon : tipoCama.icon;
            return { type: tipoCama.name, number: cantidad, icon: icon, id: tipoCama.id };
        }).filter(cama => cama.number > 0);

        const camasIdNum = nuevasCamas.map(cama => [cama.id, cama.number]);
        setCamasModificadas(camasIdNum);

        closeModal();
        // Actualizar la lista de camas después de guardar
        const updatedCamas = nuevasCamas.filter(cama => cama.number > 0);
        setCamas(updatedCamas);
    };

    return (
        <div className='flex flex-col items-center'>
            <div className="contendor-camas mt-10 md:pl-10 md:pl-0 lg:ml-[230px] text-black  ">
            <h2 className="font-bold text-lg texto-que-hay">¿Dónde dormimos?</h2>
            {camas.map(cama => (
                <div key={cama.type} className="flex items-center gap-5">
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
                <div className="modal-box bg-white text-black">
                    <h2>Seleccionar cama y número</h2>
                    <div className="modal-content-container">
                        <div className="bed-list">
                            {tiposCama.map(tipoCama => {
                                const cantidad = camas.find(cama => cama.type === tipoCama.name)?.number || 0;
                                return (
                                    <div key={tipoCama.id} className={`bed ${selectedBed && selectedBed.type === tipoCama.name ? 'selected' : ''} flex flex-col items-start`}>
                        <div className="flex items-center mb-2">
                            <Icon icon={tipoCama.icon} className=" h-[25px] w-[25px] mr-[10px]" />
                            <span>{` ${tipoCama.name}`}</span>
                        </div>
                        <input
                            className="mb-5 bed-input"
                            type="number"
                            value={numberOfBeds[tipoCama.name] || ''}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                setNumberOfBeds(prevState => ({
                                    ...prevState,
                                    [tipoCama.name]: isNaN(newValue) ? '' : newValue
                                }));
                            }}
                        />
                    </div>

                                );
                            })}
                        </div>
                    </div>
                    <div className="modal-action">
                        <button className="btn boton-cama" onClick={handleSave}>Guardar</button>
                        <button className="btn boton-cama" onClick={closeModal}>Cerrar</button>
                    </div>
                </div>
            </Modal>
        </div>
        </div>
        
    );
};

export default CamasComponent;
