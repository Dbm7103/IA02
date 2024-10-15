import React from 'react';
import { Photo } from '../types';

interface PhotoGridProps {
    photos: Photo[];
    onPhotoClick: (id: string) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
    return (
        <div className="container mt-4">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {photos.map(photo => (
                    <div key={photo.id} className="col">
                        <div
                            className="card h-100 photo-grid-card"
                            onClick={() => onPhotoClick(photo.id)}
                        >
                            <img
                                src={photo.urls.thumb}
                                alt={photo.user.name}
                                className="card-img-top"
                            />
                            <div className="card-body d-flex flex-column">
                                <div className="fixed-height">
                                    <p className="card-text text-center mb-0 flex-grow-1">{photo.user.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoGrid;
