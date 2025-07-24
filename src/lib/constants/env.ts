export const API_URL = process.env.NODE_ENV === 'development' 
  ? '' // Usar proxy en desarrollo
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7071';
  
export const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true' || false;
