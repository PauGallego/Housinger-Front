import React, { useState, useEffect } from 'react';
import './Styles/Resena.css';
import { API_BASE_URL } from '../../astro.config';
import { Modal, Box, Button, TextField, Rating } from '@mui/material';

const ResenaComponent = ({ id }) => {
    const [reviews, setReviews] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newReview, setNewReview] = useState({ stars: 0, description: '', date: '' });

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

        const checkReviewable = async () => {
            try {
                let userId = null;

                try{
                     userId = JSON.parse(localStorage.getItem('userData')).userId;
                }catch{
                    userId = null;
                }
    
                const response = await fetch(`${API_BASE_URL}/v1/review/isReviewable/${id}/${userId}`);
                if (response.ok) {
                    setCanReview(true);
                } else {
                    setCanReview(false);
                }
            } catch (error) {
                console.error('Error checking if reviewable:', error);
                setCanReview(false);
            }
        };

        fetchReviews();
        checkReviewable();
    }, [id]);

    const handleShowMore = () => {
        setShowAll(!showAll);
    };

    const handleOpenModal = () => {
        const formattedDate = new Date().toISOString();
        setNewReview({ ...newReview, date: formattedDate });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setNewReview({ ...newReview, [name]: value });
    };

    const handleSubmitReview = async () => {
        try {
            let userId = null;

            try{
                 userId = JSON.parse(localStorage.getItem('userData')).userId;
            }catch{
                userId = null;
            }

            const bodyText = JSON.stringify({
                reviewUserId: userId,
                reviewPropertyId: id,
                description: newReview.description,
                date: newReview.date,
                stars: newReview.stars
            });

            console.log(bodyText);

            const response = await fetch(`${API_BASE_URL}/v1/review/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Authentication ' + localStorage.getItem('authorization')
                },
                body: bodyText,
            });

            if (response.ok) {
                location.reload(true);
            } else {
                throw new Error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/v1/review/delete/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Authentication ' + localStorage.getItem('authorization')
                }
            });

            if (response.ok) {
               location.reload(true);
            } else {
                throw new Error('Failed to delete review');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    let userId = null;

    try{
         userId = JSON.parse(localStorage.getItem('userData')).userId;
    }catch{
        userId = null;
    }

    const notAreadyReviewd = !reviews.some(review => review.reviewUserId === userId);

    let isAdmin = localStorage.getItem("admin");


    return (
        <div>
            <div className="lg:flex mt-10 lg:ml-[210px] lg:gap-[20%] ajustar-resena flex-wrap items-center ">
                {showAll ? reviews.map(review => (
                    <div key={review.id}>
                        <div>
                            <div>
                                <div className="flex gap-5">
                                    <div>
                                        <img className="imagen-optima h-[90px] w-[100px] rounded-[50%]" src={`${API_BASE_URL}/v1/fileCustomer/download/${review.picture}`} alt="" />
                                    </div>
                                    <div className="mt-5 text-black]">
                                        <label>{`${review.name} ${review.surname} ${new Date(review.date).toLocaleDateString()}`}</label>
                                        <br />
                                        <Rating name={`rating-${review.id}`} value={review.stars} precision={0.5}  readOnly />
                                        {review.isCurrentUserReview && (
                                            <button className='text-[red]' onClick={() => handleDeleteReview(review.id)}>Eliminar</button>
                                        )}
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
                                        <Rating name={`rating-${review.id}`} value={review.stars}  precision={0.5} readOnly />
                                        {review.reviewUserId == userId  || isAdmin && (
                                            <button onClick={() => handleDeleteReview(review.id)}>Eliminar</button>
                                        )}
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
            {reviews.length > 4 && (
                <div className="lg:ml-[210px] ajustar">
                    <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px] mt-[20px]" onClick={handleShowMore}>{showAll ? "Mostrar menos" : "Mostrar más"}</button>
                </div>
            )}
            {canReview && notAreadyReviewd && (
                <div className="lg:ml-[210px] ajustar">
                    <button className="botones-propiedad text-white p-2 rounded-[5px] w-20 lg:w-40 md:w-[69px] mt-[20px]" onClick={handleOpenModal}>Dejar Reseña</button>
                </div>
            )}
            <Modal open={showModal} onClose={handleCloseModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                    <h2>Dejar una Reseña</h2>
                    <Rating
                        name="stars"
                        value={newReview.stars}
                        precision={0.5}
                        onChange={(event, newValue) => setNewReview({ ...newReview, stars: newValue })}
                    />
                    <TextField
                        label="Descripción"
                        name="description"
                        multiline
                        rows={4}
                        value={newReview.description}
                        onChange={handleReviewChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmitReview}>Enviar</Button>
                </Box>
            </Modal>
        </div>
    );
    
    
};

export default ResenaComponent;

