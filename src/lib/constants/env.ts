export const API_URL = process.env.NODE_ENV === 'development' 
  ? process.env.PUBLIC_API_URL_DEV || 'http://localhost:7071/' 
  : process.env.NEXT_PUBLIC_API_PRO || 'http://localhost:7071/';
  
export const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true' || false;
