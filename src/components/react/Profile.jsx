import '../../global.css';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../astro.config';
import { Modal, Button } from '@mui/material'; 
import { set } from 'date-fns';
import { API_BASE_URL2 } from '../../astro.config';

function ProfileComponent() {
    const [userData, setUserData] = useState(null); 

    let userId = JSON.parse(localStorage.getItem('userData')).userId;
    let token = localStorage.getItem('authorization');

    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const headers = new Headers();
                headers.append('Authorization', 'Authentication ' + token);

                const response = await fetch(API_BASE_URL + '/v1/user/get/' + userId, {
                    method: 'GET',
                    headers: headers
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los datos del usuario');
                }
                
                const userDataFromApi = await response.json();
                setUserData(userDataFromApi);

                console.log(userDataFromApi);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUserData();
    }, []);

    const uploadImg = async () => {
        const formData = new FormData();
        const fileInput = document.querySelector('#fileInput');
        formData.append('file', fileInput.files[0]);
    
        try {
            const response = await fetch(`${API_BASE_URL}/v1/fileCustomer/upload/${userData.customerEntityId}`, {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Failed to upload image');
            }
    
            const imageUrl = await response.text(); // Leer la respuesta como texto
    
            // Extraer el nombre del archivo de la URL
            const fileName = imageUrl.split('/').pop(); // Obtener la parte después de la última barra
    
            // Actualizar el estado de userData con el nombre del archivo
            setUserData(prevUserData => ({
                ...prevUserData,
                picture: fileName
            }));
    
            closeModal();
        } catch (error) {
            // Manejar errores de red u otros errores
            console.error('Error uploading images:', error);
        }
    }


    const cerrarSesion =  () => {

            localStorage.clear();

            window.location.href = API_BASE_URL2;
    }



    const uploadData = async () => {
        try {
            let name = document.querySelector('#inputNombre').value.trim();
            let surname = document.querySelector('#inputApellido').value.trim();
            let mail = document.querySelector('#inputMail').value.trim();
            let username = document.querySelector('#inputUsername').value.trim();
            let password = document.querySelector('#inputPassword').value.trim();
            let password2 = document.querySelector('#inputPassword2').value.trim();
    
            // Si los campos están vacíos, se mantienen los valores actuales
            if (name) {
                userData.name = name;
            }
    
            if (surname) {
                userData.surname = surname;
            }

            if (mail) {

                userData.mail = mail;


            }

            if (username) {

                userData.username = username;

            }

            if(  password && password !== password2) {

                alert('Las contraseñas no coinciden');
                return;
            }

            if (password ) {

                userData.password = password;

            }


            setUserData(userData);
            console.log(userData);

            const response = await fetch(`${API_BASE_URL}/v1/user/save`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Authentication ' + token,
                    'Content-Type': 'application/json' // Agregamos el tipo de contenido
                },
                body: JSON.stringify(userData), // Enviamos los datos actualizados
            });
    
            if (!response.ok) {
                throw new Error('Failed to update user data');
            }
    
            const updatedUserDataResponse = await response.json();


    
            console.log(updatedUserDataResponse);

            alert('Datos actualizados correctamente');

            location.reload(true);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };
    

    return (
        <div>
            {userData !== null ? ( // Mostrar el div solo cuando userData no sea null
                <div className='md:flex md:flex-col lg:flex-row lg:items-center lg:ml-[550px] ajustar'>
                    <div className="relative flex justify-center lg:mt-10">
                        <img
                            src={`${API_BASE_URL}/v1/fileCustomer/download/${userData.picture}`}
                            className="w-[300px] h-[200px] lg:w-[350px] lg:h-[280px] rounded-[10px]"
                            alt="foto_perfil"
                        />
                        <button className="editar-foto absolute top-[70%] left-[70%] md:top-[70%] md:left-[60%] lg:top-[70%] lg:left-[80%] transform -translate-x-1/2 flex items-center justify-center" onClick={openModal}>
                            <i className="icon-[lets-icons--img-box] text-white cambiar-foto"></i>
                        </button>

                    </div>
                    <div className="flex flex-col md:ml-[180px] lg:ml-[100px]">
                        {/* INFORMACION */}
                        <div className="mt-10">
                            <h2 className="font-bold text-xl" id="nombre_apellido">{userData.name} {userData.surname}</h2>
                            <p className="font-bold mt-2 text-xl">Informacion</p>
                        </div>

                        {/* DATOS */}
                        <div className="mt-5">
                            <div className="md:flex md:gap-2">
                                <div className="mb-2">
                                    <p>Nombre</p>
                                    <input className="input-datos w-[100%]" type="text" name="" id="inputNombre" placeholder={userData.name} />
                                </div>
                                <div className="mb-2">
                                    <p>Apellido</p>
                                    <input className="input-datos w-[100%]" type="text" name="" id="inputApellido" placeholder={userData.surname} />
                                </div>
                            </div>
                            <div className="md:flex md:gap-2">
                                <div className="mb-2">
                                    <p>Correo</p>
                                    <input className="input-datos w-[100%]" type="text" name="" id="inputMail" placeholder={userData.mail} />
                                </div>
                                <div className="mb-2">
                                    <p>Usuario</p>
                                    <input className="input-datos w-[100%]" type="text" name="" id="inputUsername" placeholder={userData.username} />
                                </div>
                            </div>
                            <div className="md:flex md:gap-2">
                                <div className="mb-2">
                                    <p>Contraseña</p>
                                    <input className="input-datos w-[100%]" type="password" name="" id="inputPassword" placeholder="Contraseña" />
                                </div>
                                <div className="mb-2">
                                    <p>Confirmar Contraseña</p>
                                    <input className="input-datos w-[100%]" type="password" name="" id="inputPassword2" placeholder="Contraseña" />
                                </div>
                               
                            </div>
                            <div className="mb-2 mt-6 flex flex-row gap-10">
                                <button className="boton-guardar w-[190px]"  onClick={uploadData}>Guardar perfil</button>
                                <button className="boton-guardar w-[190px]"  onClick={cerrarSesion}>Cerrar Sesion</button>
                                    
                            </div>
                        </div>
                    </div>
                    <Modal open={modalOpen} onClose={closeModal}>
                        <div className="fixed inset-0 flex items-center justify-center z-10">
                            <div className="modal-box bg-white p-6 rounded-lg">
                                <input type="file" id='fileInput' />
                                <div className="modal-action">
                                    <Button onClick={uploadImg}>Guardar</Button>
                                </div>
                                <div className="modal-action">
                                    <Button onClick={closeModal}>Cerrar</Button>
                                </div>
                            </div>
                        </div>
                    </Modal>


                </div>
            ) : (
                <div>Cargando...</div> 
            )}

        
        </div>
    );
}

export default ProfileComponent;
