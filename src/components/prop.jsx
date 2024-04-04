import React from 'react';

const Prop = ({ href, title, descrip, imageSrc }) => {
    return (
        <div className="propiedad ml-[30px] lg:ml-[1%] lg:w-[400px]">
            <a href={href}>
                {imageSrc && <img src={imageSrc} className="w-[90%] h-[auto] rounded-[20px] lg:w-[100%]" />}
                <h2 className="lugar">
                    {title}
                </h2>
                <h2 className="descripcion">
                    {descrip}
                </h2>
            </a>
        </div>
    );
};

export default Prop;
