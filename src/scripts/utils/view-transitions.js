// Check if View Transitions API is supported
const isViewTransitionsAPISupported = () => 
    Boolean(document.startViewTransition);
  
  // Apply view transitions if supported
  export const applyViewTransition = async (callback) => {
    // If View Transitions API is not supported, just run the callback
    if (!isViewTransitionsAPISupported()) {
      return callback();
    }
  
    // Use the View Transitions API
    return document.startViewTransition(callback).ready;
  };