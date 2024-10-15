export interface Photo {
    id: string;
    urls: {
        thumb: string;
        full: string;
    };
    user: {
        name: string;
    };
    description?: string; // có thể không có
    title?: string; // có thể không có
}
