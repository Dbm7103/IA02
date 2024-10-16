// Import các hook và component cần thiết từ react-router-dom và react
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Import các component PhotoGrid, PhotoDetails, file CSS và type cho Photo
import PhotoGrid from './components/PhotoGrid';
import PhotoDetails from './components/PhotoDetails';
import './index.css';
import { Photo } from './types';

// Khóa API Unsplash (được sử dụng để xác thực yêu cầu)
const UNSPLASH_ACCESS_KEY = 'hA8R6vWX5HKRepquCuTpIlzPV96tUht7wUZtEu94L28';

// Tạo một instance của axios với baseURL là API của Unsplash
const api = axios.create({
    baseURL: 'https://api.unsplash.com', // URL chính của API Unsplash
    headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`, // Thêm khóa API vào header của request
    },
});

// Hàm gọi API để lấy danh sách ảnh từ Unsplash, với số trang và số lượng ảnh trên mỗi trang
const fetchPhotos = async (page: number, per_page: number = 6) => {
    // return []; // Trả về mảng rỗng để test
    const response = await api.get('/photos', { params: { page, per_page } }); // Gửi request với các tham số
    return response.data; // Trả về dữ liệu ảnh
};

function App() {
    // Khai báo các state để lưu trữ danh sách ảnh, số trang hiện tại, trạng thái loading và kiểm tra còn ảnh để tải hay không
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [page, setPage] = useState(1); // Khởi tạo với trang đầu tiên
    const [loading, setLoading] = useState(false); // Trạng thái loading khi đang tải ảnh
    const [hasMore, setHasMore] = useState(true); // Kiểm tra còn ảnh để tải hay không

    const navigate = useNavigate(); // Sử dụng để điều hướng
    const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

    // useEffect được sử dụng để tải ảnh khi số trang hoặc đường dẫn thay đổi
    useEffect(() => {
        const loadPhotos = async () => {
            setLoading(true); // Bắt đầu trạng thái loading
            try {
                // Tạo độ trễ 1 giây trước khi tải ảnh (giả lập tải lâu)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Gọi API để lấy ảnh
                const newPhotos = await fetchPhotos(page, 6);

                // Cập nhật state với danh sách ảnh mới
                setPhotos(prevPhotos => {
                    const uniquePhotos = newPhotos.filter((newPhoto: Photo) =>
                        !prevPhotos.some(photo => photo.id === newPhoto.id)
                    ); // Loại bỏ các ảnh đã có
                    return [...prevPhotos, ...uniquePhotos]; // Thêm các ảnh mới
                });

                // Nếu số lượng ảnh tải về ít hơn yêu cầu thì set hasMore thành false
                if (newPhotos.length < 6) {
                    setHasMore(false);
                }

            } catch (error) {
                console.error('Error fetching photos:', error); // Bắt lỗi nếu có lỗi xảy ra
                navigate('/error'); // Chuyển hướng đến trang lỗi
            } finally {
                setLoading(false); // Kết thúc trạng thái loading
            }
        };

        // Chỉ tải ảnh khi đang ở đường dẫn '/photos' và còn ảnh để tải
        if (location.pathname === '/photos' && hasMore) {
            loadPhotos();
        }
    }, [page, location.pathname, hasMore, navigate]);

    // useEffect để theo dõi sự kiện scroll và tải thêm ảnh khi người dùng cuộn xuống cuối trang
    useEffect(() => {
        const handleScroll = () => {
            // Kiểm tra nếu người dùng đã cuộn đến cuối trang, không đang loading và còn ảnh để tải
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 1 &&
                !loading &&
                hasMore
            ) {
                setPage(prevPage => prevPage + 1); // Tăng số trang lên để tải thêm ảnh
            }
        };

        // Thêm sự kiện scroll
        window.addEventListener('scroll', handleScroll);

        // Xóa sự kiện scroll khi component bị unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    // Hàm xử lý khi người dùng click vào ảnh
    const handlePhotoClick = (id: string) => {
        navigate(`/photos/${id}`); // Điều hướng đến trang chi tiết của ảnh đó
    };

    return (
        <div className="container">
            <h1 className="text-center my-4">UnSplash Editor</h1>

            {/* Định nghĩa các route trong ứng dụng */}
            <Routes>
                {/* Điều hướng từ đường dẫn gốc "/" đến "/photos" */}
                <Route path="/" element={<Navigate to="/photos" replace />} />

                {/* Route để hiển thị danh sách ảnh (PhotoGrid) */}
                <Route
                    path="/photos"
                    element={<PhotoGrid photos={photos} onPhotoClick={handlePhotoClick} />}
                />

                {/* Route để hiển thị chi tiết ảnh */}
                <Route path="/photos/:id" element={<PhotoDetails />} />

                {/* Route trang lỗi */}
                <Route path="/error" element={<div className="text-center error-message">Có lỗi xảy ra. Vui lòng thử lại sau.</div>} />
            </Routes>

            {/* Hiển thị spinner khi đang tải ảnh */}
            {loading && location.pathname === '/photos' && (
                <div className="d-flex justify-content-center my-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {/* Hiển thị thông báo khi không còn ảnh để tải */}
            {!hasMore && location.pathname === '/photos' && (
                <p className="text-center my-4">Không còn ảnh nào để tải thêm</p>
            )}
        </div>
    );
}

export default App;
