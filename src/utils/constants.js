export const isProd = process.env.NODE_ENV === 'production';

export const BASE_API_URL = isProd ? '' : 'http://localhost:5000';
