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

const fetchPhotos = async (page: number, per_page: number = 10) => {
    const response = await api.get('/photos', { params: { page, per_page } });
    return response.data;
};

function App() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const getPhotos = async () => {
            setLoading(true);
            const newPhotos = await fetchPhotos(page, 10);
            setPhotos(prevPhotos => {
                const uniquePhotos = newPhotos.filter((newPhoto : Photo) => !prevPhotos.some(photo => photo.id === newPhoto.id));
                return [...prevPhotos, ...uniquePhotos];
            });
            setLoading(false);
            if (newPhotos.length === 0) {
                setHasMore(false);
            }
        };
        getPhotos();
    }, [page]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 1 || loading || !hasMore) {
                return;
            }
            setPage(prevPage => prevPage + 1);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    return (
        <div>
            <h1>UnSplash Editor</h1>
            <PhotoGrid photos={photos} onPhotoClick={setSelectedPhoto} />
            {loading && <div className="loading-spinner"></div>}
            <PhotoDetails selectedPhoto={selectedPhoto} />
        </div>
    );
}

export default App;
