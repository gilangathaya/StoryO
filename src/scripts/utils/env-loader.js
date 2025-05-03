// Simple utility to load environment variables from process.env
// This will be processed by webpack during build
const loadEnvironmentVariables = () => {
    try {
      // Check if MAP_SERVICE_API_KEY is available
      if (process.env.MAP_SERVICE_API_KEY) {
        console.log('Map API key loaded successfully');
      } else {
        console.warn('Map API key not found in environment variables');
      }
    } catch (error) {
      console.error('Error loading environment variables:', error);
    }
  };
  
  export default loadEnvironmentVariables;