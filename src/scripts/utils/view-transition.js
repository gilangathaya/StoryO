/**
 * Applies view transition if supported by the browser
 * @param {Function} callback - The function to execute during the transition
 * @returns {Promise} - Promise that resolves when the transition is complete
 */
export async function applyViewTransition(callback) {
  // Check if view transitions are supported
  if (!document.startViewTransition) {
    return callback();
  }

  // Start the view transition
  return document.startViewTransition(async () => {
    await callback();
  });
} 