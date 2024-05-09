
const ProfileForm = () => {
    return (
        <div className="flex flex-col md:ml-[180px] lg:ml-[100px]">
            {/* INFORMACION */}
            <div className="mt-10">
                <h2 className="font-bold text-xl" id="nombre_apellido">Maria Perez</h2>
                <p className="font-bold mt-2 text-xl">Informacion</p>
            </div>

            {/* DATOS */}
            <div className="mt-5">
                <div className="md:flex md:gap-2">
                    <div className="mb-2">
                        <p>Nombre</p>
                        <input className="input-datos w-[100%]" type="text" name="" id="" placeholder="Nombre" />
                    </div>
                    <div className="mb-2">
                        <p>Apellido</p>
                        <input className="input-datos w-[100%]" type="text" name="" id="" placeholder="Apellido" />
                    </div>
                </div>
                <div className="md:flex md:gap-2">
                    <div className="mb-2">
                        <p>Correo</p>
                        <input className="input-datos w-[100%]" type="text" name="" id="" placeholder="Correo" />
                    </div>
                    <div className="mb-2">
                        <p>Usuario</p>
                        <input className="input-datos w-[100%]" type="text" name="" id="" placeholder="Usuario" />
                    </div>
                </div>
                <div className="md:flex md:gap-2">
                    <div className="mb-2">
                        <p>Contraseña</p>
                        <input className="input-datos w-[100%]" type="password" name="" id="" placeholder="Contraseña" />
                    </div>
                    <div className="mb-2 mt-6">
                        <button className="boton-guardar w-[190px]">Guardar perfil</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm;
