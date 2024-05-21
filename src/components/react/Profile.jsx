import '../../global.css';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../astro.config';
import { Modal, Button } from '@mui/material'; 
import { set } from 'date-fns';
import { API_BASE_URL2 } from '../../astro.config';

function ProfileComponent() {
    const [userData, setUserData] = useState(null); 


    let userId = null;
    let token = localStorage.getItem('authorization');

    try{
        userId = JSON.parse(localStorage.getItem('userData')).userId;
    }catch{
        window.location.href = `${API_BASE_URL2}`;
    }

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
            const fileName = imageUrl.match(/([^\/\\]+)$/)[0];

            setUserData(prevUserData => ({
                ...prevUserData,
                picture: fileName
            }));

            let localdata = JSON.parse(localStorage.getItem("userData"));

            localdata.picture = fileName;

            localStorage.setItem("userData", JSON.stringify(localdata));
            
            closeModal();

            location.reload(true);
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

            if (name && name.charAt(0) !== name.charAt(0).toUpperCase()) {
                const erroresMostrar = document.getElementById('errores-mostrar');
                erroresMostrar.innerHTML = "El nombre debe comenzar con mayúscula.";
                erroresMostrar.style.color = 'red';
                return;
            }
    
            if (surname) {
                userData.surname = surname;
            }

            if (surname && surname.charAt(0) !== surname.charAt(0).toUpperCase()) {
                const erroresMostrar = document.getElementById('errores-mostrar');
                erroresMostrar.innerHTML = "El apellido debe comenzar con mayúscula.";
                erroresMostrar.style.color = 'red';
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (mail && !emailRegex.test(mail)) {
                const erroresMostrar = document.getElementById('errores-mostrar');
                erroresMostrar.innerHTML = "El correo electrónico ingresado no es válido.";
                erroresMostrar.style.color = 'red';
                return;
            }

            if (mail) {
                userData.mail = mail;
            }
            
            if (username) {
                userData.username = username;
            }

            if (password && password !== password2) {
                const erroresMostrar = document.getElementById('errores-mostrar');
                erroresMostrar.innerHTML = "Las contraseñas no coinciden.";
                erroresMostrar.style.color = 'red';
                return;
            }

            if (password ) {
                userData.password = password;
            }
            setUserData(userData);
            console.log(userData);
            
            let token = localStorage.getItem('authorization');
            const response = await fetch(`${API_BASE_URL}/v1/user/save`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Authentication ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData), 
            });
    
            if (!response.ok) {
                throw new Error('Failed to update user data');
            }
            const updatedUserDataResponse = await response.json();
            console.log(updatedUserDataResponse);

            const erroresMostrar = document.getElementById('errores-mostrar');
            erroresMostrar.innerHTML = "Datos actulizados correctamente.";
            erroresMostrar.style.color = 'green';

            let localdata = JSON.parse(localStorage.getItem("userData"));

            localdata.mail = userData.mail;
            localdata.surname = userData.surname;
            localdata.name = userData.name;
            

            localStorage.setItem("userData", JSON.stringify(localdata));


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
                    <div className="flex lg:justify-center	lg:items-center flex-col md:ml-[180px]">
                        {/* INFORMACION */}
                        <div className="mt-10 ml-10 md:ml-0">
                            <h2 className="font-bold text-xl" id="nombre_apellido">{userData.name} {userData.surname}</h2>
                            <p className="font-bold mt-2 text-xl">Informacion</p>
                        </div>

                        {/* DATOS */}
                        <div className="mt-5">
                            <div className="md:flex md:gap-2">
                                <div className="mb-2">
                                    <p className="ml-10 md:ml-0">Nombre</p>
                                    <input className="input-datos ml-10 md:ml-0 w-[80%] md:w-[100%]" type="text" name="" id="inputNombre" placeholder={userData.name} />
                                </div>
                                <div className="mb-2">
                                    <p className="ml-10 md:ml-0">Apellido</p>
                                    <input className="input-datos ml-10 md:ml-0 w-[80%] md:w-[100%]" type="text" name="" id="inputApellido" placeholder={userData.surname} />
                                </div>
                            </div>
                            <div className="md:flex md:gap-2">
                                <div className="mb-2">
                                    <p className="ml-10 md:ml-0">Correo</p>
                                    <input className="input-datos ml-10 md:ml-0 w-[80%] md:w-[100%]" type="text" name="" id="inputMail" placeholder={userData.mail} />
                                </div>
                                <div className="mb-2">
                                    <p className="ml-10 md:ml-0">Usuario</p>
                                    <input className="input-datos ml-10 md:ml-0 w-[80%] md:w-[100%]" type="text" name="" id="inputUsername" placeholder={userData.username} />
                                </div>
                            </div>
                            <div className="md:flex md:gap-2">
                                <div className="mb-2">
                                    <p className="ml-10 md:ml-0">Contraseña</p>
                                    <input className="input-datos ml-10 md:ml-0 w-[80%] md:w-[100%]" type="password" name="" id="inputPassword" placeholder="Contraseña" />
                                </div>
                                <div className="mb-2">
                                    <p className="ml-10 md:ml-0">Confirmar Contraseña</p>
                                    <input className="input-datos ml-10 md:ml-0 w-[80%] md:w-[100%]" type="password" name="" id="inputPassword2" placeholder="Contraseña" />
                                </div>
                            </div>
                            <div className="mb-2 mt-6 flex flex-col md:flex-row lg:flex-row gap-5">
                                <button className="boton-guardar ml-10 md:ml-0 w-[80%] md:w-[31%] lg:w-[100%]"  onClick={uploadData}>Guardar perfil</button>
                                <button className="boton-cerrar ml-10 md:ml-0 w-[80%] md:w-[31%] lg:w-[100%]"  onClick={cerrarSesion}>Cerrar Sesion</button>
                            </div>
                        </div>
                        <span id='errores-mostrar'></span>
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
                <div className='flex items-center justify-center'>
                    <img className='h-[300px] w-[400px]' src="../../cargar.gif" alt="Cargando..." />
                </div>
            )}
        </div>
    );
}

export default ProfileComponent;
