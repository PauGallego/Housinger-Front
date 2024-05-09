import React from 'react';
import './Styles/Resena.css';

const ResenaComponent = () => {
    return (
        <div>
            <div className="lg:flex gap-5 mt-10 lg:ml-[210px] lg:gap-[160px] ajustar-resena">
                <div>
                    <div className="flex gap-5">
                        <div>
                            <img className="imagen-optima h-[90px] w-[100px] rounded-[50%]" src="../../public/perfil2.jpg" alt="" />
                        </div>
                        <div className="mt-5">
                            <label>Adrian 05/02/2024</label>
                            <br />
                            <div className="rating">
                                <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500" />
                                <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500"  />
                                <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500" />
                                <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500" />
                                <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <textarea className="h-[100px] w-[300px] " placeholder='Buena ubicacion para disfrutar con la familia y propietaria muy maja y amable. El intermacambio fue rapido y sencillo.'></textarea>
                    </div>
                </div>
                <div>
                    <div className="flex gap-5">
                        <div>
                            <img className="imagen-optima h-[90px] w-[100px] rounded-[50%]" src="../../public/perfil2.jpg" alt="" />
                        </div>
                        <div className="mt-5">
                            <label>Adrian 05/02/2024</label>
                            <br />
                            <div className="rating">
                                <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500" />
                                <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500"  />
                                <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500" />
                                <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500" />
                                <input type="radio" name="rating-4" className="mask mask-star-2 bg-yellow-500" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <textarea className="h-[100px] w-[300px] " placeholder='Buena ubicacion para disfrutar con la familia y propietaria muy maja y amable. El intermacambio fue rapido y sencillo.'></textarea>
                    </div>
                </div>
                
            </div>
            <div className="lg:ml-[210px] ajustar">
                <button className="boton-modal lg:w-40">Mostrar más</button>
            </div>
        </div>
    );
};

export default ResenaComponent;
