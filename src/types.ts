export interface Photo {
    id: string;
    urls: {
        regular: string;
        full: string;
    };
    user: {
        name: string;
    };
    description?: string; // có thể không có
    title?: string; // có thể không có
}
