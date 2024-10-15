import React, { useEffect, useState } from 'react';
import { Photo } from '../types';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'hA8R6vWX5HKRepquCuTpIlzPV96tUht7wUZtEu94L28';

const api = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
});

const fetchPhotoDetails = async (id: string) => {
    const response = await api.get(`/photos/${id}`);
    return response.data;
};

const PhotoDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const getPhotoDetails = async () => {
                setLoading(true);
                try {
                    // Simulate loading delay
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    const photoDetails = await fetchPhotoDetails(id);
                    setSelectedPhoto(photoDetails);
                    setError(null);
                } catch (error) {
                    console.error('Error fetching photo details:', error);
                    setError('Could not load photo details.');
                } finally {
                    setLoading(false);
                }
            };

            getPhotoDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center my-5">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) return <p className="error-message">{error}</p>;

    if (!selectedPhoto) return <p className="no-more-photos">No photo found</p>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={selectedPhoto.urls.full}
                        alt={selectedPhoto.description || 'Photo'}
                        className="img-fluid"
                        style={{ height: '100%', objectFit: 'contain' }}
                    />
                </div>
                <div className="col-md-6 d-flex align-items-stretch">
                    <div className="card flex-fill photo-detail-card">
                        <div className="card-body">
                            <h5 className="card-title text-danger">
                                Author: {selectedPhoto.user.name}
                            </h5>
                            <h6 className="card-subtitle mb-2 text-muted">
                                Title: {selectedPhoto.title || 'No title available'}
                            </h6>
                            <p className="card-text">
                                Description: {selectedPhoto.description || 'No description available'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoDetailPage;
