// Enhanced utility to load environment variables from process.env
// This will be processed by webpack during build
const loadEnvironmentVariables = () => {
  try {
    // Check if MAP_SERVICE_API_KEY is available
    if (process.env.MAP_SERVICE_API_KEY) {
      console.log('Map API key loaded successfully:', process.env.MAP_SERVICE_API_KEY.substring(0, 4) + '...');
    } else {
      console.warn('Map API key not found in environment variables. Check your .env file.');
      
      // Add diagnostic information to help troubleshoot
      console.info('Make sure you have created a .env file in the root directory.');
      console.info('The .env file should contain: MAP_SERVICE_API_KEY=your_api_key');
    }
    
    // Add this diagnostic log to help identify process.env availability
    console.log('Environment variables available:', Object.keys(process.env).filter(key => !key.includes('NODE_')));
    
  } catch (error) {
    console.error('Error loading environment variables:', error);
    
    // Show where the error occurred for better debugging
    console.error('Error stack:', error.stack);
  }
};

export default loadEnvironmentVariables;