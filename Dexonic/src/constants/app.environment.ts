const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const CONTEXT_PATH = process.env.NEXT_PUBLIC_CONTEXT_PATH || '/api/v2/';

export { BACKEND_URL, CONTEXT_PATH };
