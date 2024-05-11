import React, { useState, useEffect } from 'react';
import './Styles/Resena.css';
import { API_BASE_URL } from '../../astro.config';

const ResenaComponent = ({ id }) => {
    const [reviews, setReviews] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/v1/propertyReviews/get/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data.reviews);
                } else {
                    throw new Error('Failed to fetch reviews');
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, [id]);

    const handleShowMore = () => {
        setShowAll(!showAll); 
    };

    return (
        <div>
            <div className="lg:flex  mt-10 lg:ml-[210px] lg:gap-[120px] ajustar-resena flex-wrap items-center ">
                
                {showAll ? reviews.map(review => (
                    <div key={review.id}>
                        <div>
                            <div>
                                <div className="flex  gap-5">
                                    <div>
                                        <img className="imagen-optima h-[90px] w-[100px] rounded-[50%]" src={`${API_BASE_URL}/v1/fileCustomer/download/${review.picture}`} alt="" />
                                    </div>
                                    <div className="mt-5">
                                        <label>{`${review.name} ${review.surname} ${new Date(review.date).toLocaleDateString()}`}</label>
                                        <br />
                                        <div className="rating">
                                            {[...Array(5)].map((_, index) => (
                                                <input
                                                    key={index}
                                                    type="radio"
                                                    name={`rating-${review.id}`}
                                                    className="mask mask-star-2 bg-yellow-500"
                                                    checked={index < Math.round(review.stars)}
                                                    readOnly
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <p className="h-[100px] w-[300px]" readOnly>{review.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : reviews.slice(0, 4).map(review => (
                    <div key={review.id}>
                        <div>
                            <div>
                                <div className="flex gap-5">
                                    <div>
                                        <img className="imagen-optima h-[90px] w-[100px] rounded-[50%]" src={`${API_BASE_URL}/v1/fileCustomer/download/${review.picture}`} alt="" />
                                    </div>
                                    <div className="mt-5">
                                        <label>{`${review.name} ${review.surname} ${new Date(review.date).toLocaleDateString()}`}</label>
                                        <br />
                                        <div className="rating">
                                            {[...Array(5)].map((_, index) => (
                                                <input
                                                    key={index}
                                                    type="radio"
                                                    name={`rating-${review.id}`}
                                                    className="mask mask-star-2 bg-yellow-500"
                                                    checked={index < Math.round(review.stars)}
                                                    readOnly
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <p className="h-[100px] w-[300px]" readOnly>{review.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Mostrar botón "Mostrar más" solo si hay más de 4 reseñas */}
            {reviews.length > 4 && (
                <div className="lg:ml-[210px] ajustar">
                    <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px] mt-[20px]" onClick={handleShowMore}>{showAll ? "Mostrar menos" : "Mostrar más"}</button>
                </div>
            )}
        </div>
    );
};

export default ResenaComponent;
