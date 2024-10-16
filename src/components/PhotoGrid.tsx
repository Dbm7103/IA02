import React from 'react'; // Import React cho chức năng component
import { Photo } from '../types'; // Import type Photo để xác định kiểu dữ liệu của ảnh

// Định nghĩa các props mà PhotoGrid nhận vào
interface PhotoGridProps {
    photos: Photo[]; // Danh sách các ảnh, kiểu dữ liệu là mảng Photo
    onPhotoClick: (id: string) => void; // Hàm được gọi khi người dùng click vào một ảnh
}

// Tạo component PhotoGrid, nhận vào danh sách ảnh và hàm onPhotoClick thông qua props
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
                                    <p className="card-text text-center mb-0 flex-grow-1">
                                        {photo.user.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoGrid; // Xuất component PhotoGrid
