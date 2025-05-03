const loadingIndicator = document.getElementById('loading-indicator');

const showLoading = () => {
  loadingIndicator.classList.add('show');
};

const hideLoading = () => {
  loadingIndicator.classList.remove('show');
};

export { showLoading, hideLoading };