import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PhotoGrid from './components/PhotoGrid';
import PhotoDetails from './components/PhotoDetails';
import './index.css';
import { Photo } from './types';

const UNSPLASH_ACCESS_KEY = 'hA8R6vWX5HKRepquCuTpIlzPV96tUht7wUZtEu94L28';

const api = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
});

const fetchPhotos = async (page: number, per_page: number = 6) => {
    const response = await api.get('/photos', { params: { page, per_page } });
    return response.data;
};

function App() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const loadPhotos = async () => {
            setLoading(true);
            try {
                // Tạo độ trễ 1 giây trước khi tải ảnh
                await new Promise(resolve => setTimeout(resolve, 1000));
                const newPhotos = await fetchPhotos(page, 6);
                setPhotos(prevPhotos => {
                    const uniquePhotos = newPhotos.filter((newPhoto: Photo) =>
                        !prevPhotos.some(photo => photo.id === newPhoto.id)
                    );
                    return [...prevPhotos, ...uniquePhotos];
                });
                setLoading(false);
                if (newPhotos.length < 6) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error fetching photos:', error);
                setLoading(false);
                // Chuyển hướng đến trang lỗi hoặc trang chính
                navigate('/error'); // Hoặc trang khác mà bạn đã tạo để hiển thị lỗi
            }
        };

        if (location.pathname === '/photos' && hasMore) {
            loadPhotos();
        }
    }, [page, location.pathname, hasMore, navigate]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 1 &&
                !loading &&
                hasMore
            ) {
                setPage(prevPage => prevPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    const handlePhotoClick = (id: string) => {
        navigate(`/photos/${id}`);
    };

    return (
        <div className="container">
            <h1 className="text-center my-4">UnSplash Editor</h1>
            <Routes>
                <Route path="/" element={<Navigate to="/photos" replace />} />
                <Route
                    path="/photos"
                    element={<PhotoGrid photos={photos} onPhotoClick={handlePhotoClick} />}
                />
                <Route
                    path="/photos/:id"
                    element={<PhotoDetails />}
                />
                <Route path="/error" element={<div className="text-center error-message">Có lỗi xảy ra. Vui lòng thử lại sau.</div>} /> {/* Trang lỗi */}
            </Routes>
            {loading && location.pathname === '/photos' && (
                <div className="d-flex justify-content-center my-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {!hasMore && location.pathname === '/photos' && (
                <p className="text-center my-4">Không còn ảnh nào để tải thêm</p>
            )}
        </div>
    );
}

export default App;
