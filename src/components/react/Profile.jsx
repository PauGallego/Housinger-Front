import '../../global.css';
function ProfileComponent() {
    return (
        <div className="relative flex justify-center lg:mt-10">
            <img
                src="/public/perfil.jpg"
                className="w-[300px] h-[200px] lg:w-[350px] lg:h-[280px] rounded-[10px]"
                alt="foto_perfil"
            />
            <button className="editar-foto absolute top-[70%] left-[70%] md:top-[70%] md:left-[60%] lg:top-[70%] lg:left-[80%] transform -translate-x-1/2 flex items-center justify-center">
                <i className="icon-[lets-icons--img-box] text-white cambiar-foto"></i>
            </button>
        </div>

        
    );
}

export default ProfileComponent;
