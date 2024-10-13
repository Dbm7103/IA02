import React from 'react';
import { Photo } from '../types';

interface PhotoDetailsProps {
    selectedPhoto: Photo | null;
}

const PhotoDetails: React.FC<PhotoDetailsProps> = ({ selectedPhoto }) => {
    if (!selectedPhoto) return null;

    return (
        <div className="photo-details">
            <h2>Photo Details</h2>
            <img src={selectedPhoto.urls.thumb} alt={selectedPhoto.user.name} className="photo-detail-img" />
            <p>Author: {selectedPhoto.user.name}</p>
        </div>
    );
};

export default PhotoDetails;
