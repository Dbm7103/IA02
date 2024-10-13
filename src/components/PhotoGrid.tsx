import React from 'react';
import { Photo } from '../types';

interface PhotoGridProps {
    photos: Photo[];
    onPhotoClick: (photo: Photo) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
    return (
        <div className="photo-grid">
            {photos.map(photo => (
                <div key={photo.id} onClick={() => onPhotoClick(photo)} className="photo-item">
                    <img
                        src={photo.urls.thumb}
                        alt={photo.user.name}
                        className="photo-img"
                    />
                    <p className="photo-author">{photo.user.name}</p>
                </div>
            ))}
        </div>
    );
};

export default PhotoGrid;
