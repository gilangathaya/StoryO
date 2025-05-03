export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <div class="form-container">
          <h1 class="form-title">Tentang StoryApp</h1>
          
          <div class="about-content">
            <p>StoryApp adalah aplikasi berbagi cerita yang memungkinkan pengguna untuk:</p>
            
            <ul>
              <li>Melihat cerita dari pengguna lain</li>
              <li>Melihat lokasi cerita pada peta</li>
              <li>Menambahkan cerita baru dengan foto dan lokasi</li>
            </ul>
            
            <p>Aplikasi ini menggunakan:</p>
            <ul>
              <li>Webpack untuk proses bundling</li>
              <li>Babel untuk transpile JavaScript</li>
              <li>View Transitions API untuk transisi halaman</li>
              <li>Leaflet untuk menampilkan peta</li>
              <li>Story API sebagai sumber data</li>
            </ul>
            
            <p>Dikembangkan sebagai project untuk Dicoding Indonesia.</p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}