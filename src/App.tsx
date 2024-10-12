import { useEffect, useState } from 'react';
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'hA8R6vWX5HKRepquCuTpIlzPV96tUht7wUZtEu94L28';

const api = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
});

const fetchPhotos = async () => {
    const response = await api.get('/photos');
    return response.data;
};

interface Photo {
    id: string;
    urls: {
        thumb: string;
    };
    user: {
        name: string;
    };
}

function App() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    useEffect(() => {
        const getPhotos = async () => {
            const photos = await fetchPhotos();
            console.log(photos)
            setPhotos(photos);
        };
        getPhotos();
    }, []);

    return (
        <div>
            <h1>UnSplash Editor</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {photos.map(photo => (
                    <div key={photo.id} onClick={() => setSelectedPhoto(photo)} style={{ cursor: 'pointer' }}>
                        <img src={photo.urls.thumb} alt={photo.user.name} style={{ width: '100%' }} />
                        <p>{photo.user.name}</p>
                    </div>
                ))}
            </div>
            {selectedPhoto && (
                <div>
                    <h2>Photo Details</h2>
                    <img src={selectedPhoto.urls.thumb} alt={selectedPhoto.user.name} />
                    <p>Author: {selectedPhoto.user.name}</p>
                    {/* Add more details as needed */}
                </div>
            )}
        </div>
    );
}

export default App;