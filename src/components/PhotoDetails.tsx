import React, { useEffect, useState } from 'react'; // Import các hook React để quản lý trạng thái và hiệu ứng
import { Photo } from '../types'; // Import kiểu dữ liệu Photo
import { useParams } from 'react-router-dom'; // Sử dụng hook useParams để lấy các tham số động từ URL
import axios from 'axios'; // Import axios để gọi API

// Khóa API của Unsplash
const UNSPLASH_ACCESS_KEY = 'hA8R6vWX5HKRepquCuTpIlzPV96tUht7wUZtEu94L28';

// Khởi tạo đối tượng axios với baseURL và headers, bao gồm Client-ID để xác thực
const api = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
});

// Hàm fetch chi tiết ảnh từ API Unsplash, trả về dữ liệu chi tiết của ảnh
const fetchPhotoDetails = async (id: string) => {
    const response = await api.get(`/photos/${id}`);
    return response.data;
};

// Component PhotoDetailPage để hiển thị chi tiết một ảnh
const PhotoDetailPage: React.FC = () => {
    // Lấy id từ URL thông qua useParams hook
    const { id } = useParams<{ id: string }>();

    // Trạng thái lưu trữ chi tiết của ảnh, lỗi và trạng thái tải
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null); // Ảnh được chọn
    const [error, setError] = useState<string | null>(null); // Trạng thái lỗi
    const [loading, setLoading] = useState(true); // Trạng thái đang tải

    // Sử dụng useEffect để gọi API khi component được mount hoặc khi id thay đổi
    useEffect(() => {
        if (id) {
            // Hàm lấy chi tiết ảnh
            const getPhotoDetails = async () => {
                setLoading(true); // Đặt trạng thái đang tải
                try {
                    // Tạo độ trễ 1 giây để mô phỏng quá trình tải
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    // Gọi API để lấy chi tiết ảnh
                    const photoDetails = await fetchPhotoDetails(id);
                    setSelectedPhoto(photoDetails); // Lưu chi tiết ảnh vào state
                    setError(null); // Xóa thông báo lỗi nếu thành công
                } catch (error) {
                    console.error('Error fetching photo details:', error);
                    setError('Could not load photo details.'); // Hiển thị lỗi nếu có vấn đề xảy ra
                } finally {
                    setLoading(false); // Kết thúc quá trình tải
                }
            };

            getPhotoDetails(); // Gọi hàm để lấy chi tiết ảnh
        }
    }, [id]); // Mỗi khi id thay đổi, effect này sẽ chạy lại

    // Nếu đang tải, hiển thị loading spinner
    if (loading) {
        return (
            <div className="d-flex justify-content-center my-5">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    // Nếu có lỗi, hiển thị thông báo lỗi
    if (error) return <p className="error-message">{error}</p>;

    // Nếu không tìm thấy ảnh, hiển thị thông báo không có ảnh
    if (!selectedPhoto) return <p className="no-more-photos">No photo found</p>;

    // Hiển thị chi tiết của ảnh đã chọn
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={selectedPhoto.urls.full} // Đường dẫn ảnh full-size
                        alt={selectedPhoto.description || 'Photo'} // Mô tả của ảnh (nếu có)
                        className="img-fluid" // Bootstrap class để làm ảnh phản hồi với kích thước màn hình
                        style={{ height: '100%', objectFit: 'contain' }} // Ảnh được co dãn để phù hợp với không gian
                    />
                </div>
                <div className="col-md-6 d-flex align-items-stretch">
                    <div className="card flex-fill photo-detail-card">
                        <div className="card-body">
                            <h5 className="card-title text-danger">
                                Author: {selectedPhoto.user.name} {/* Hiển thị tên tác giả của ảnh */}
                            </h5>
                            <h6 className="card-subtitle mb-2 text-muted">
                                Title: {selectedPhoto.title || 'No title available'} {/* Hiển thị tiêu đề của ảnh, hoặc thông báo không có tiêu đề */}
                            </h6>
                            <p className="card-text">
                                Description: {selectedPhoto.description || 'No description available'} {/* Hiển thị mô tả của ảnh */}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoDetailPage; // Xuất component PhotoDetailPage
