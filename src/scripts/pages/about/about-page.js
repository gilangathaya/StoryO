export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <div class="about-container">
          <h1 class="about-title">Tentang StoryApp</h1>
          
          <div class="about-content">
            <p class="about-description">
              StoryApp adalah platform digital yang memungkinkan Anda untuk berbagi cerita dan pengalaman 
              dengan cara yang lebih interaktif dan personal. Dengan StoryApp, setiap cerita menjadi lebih 
              hidup karena dapat dilengkapi dengan foto dan lokasi spesifik.
            </p>
            
            <h2 class="about-subtitle">Fitur Utama</h2>
            <ul class="about-features">
              <li>📸 Berbagi cerita dengan foto</li>
              <li>📍 Tandai lokasi cerita Anda</li>
              <li>🔍 Temukan cerita dari berbagai tempat</li>
              <li>👥 Berinteraksi dengan cerita orang lain</li>
            </ul>
            
            <h2 class="about-subtitle">Visi Kami</h2>
            <p class="about-description">
              Kami percaya bahwa setiap tempat memiliki cerita uniknya sendiri. StoryApp hadir untuk 
              membantu Anda menangkap momen-momen berharga dan membagikannya dengan dunia, sambil 
              menciptakan peta digital dari kenangan dan pengalaman.
            </p>
            
            <h2 class="about-subtitle">Tim Kami</h2>
            <p class="about-description">
              StoryApp dikembangkan oleh Gilang Athaya kelas FC-10 dari stream Front-end dan Back-end Development yang berdedikasi untuk menciptakan pengalaman berbagi 
              cerita yang lebih bermakna. Kami terus berinovasi untuk memberikan fitur-fitur terbaik 
              bagi pengguna kami.
            </p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // No additional setup needed for about page
  }
}