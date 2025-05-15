const About = {
  async render() {
    return `
      <section class="container">
        <div class="about-container" style="max-width: 800px; margin: 40px auto 0 auto; background: var(--card-bg); border-radius: 16px; box-shadow: var(--shadow); padding: 48px 32px;">
          <h1 class="about-title" style="text-align:center; margin-bottom: 32px; color: var(--primary-color); font-size:2.2rem;">Tentang <span style='color:var(--secondary-color)'>StoryApp</span></h1>
          <div class="about-content" style="font-size:1.1rem; line-height:1.7;">
            <p class="about-description" style="margin-bottom: 24px;">
              <b>StoryApp</b> adalah platform digital yang memungkinkan Anda untuk berbagi cerita dan pengalaman dengan cara yang lebih interaktif dan personal. Setiap cerita menjadi lebih hidup karena dapat dilengkapi dengan foto dan lokasi spesifik.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start; justify-content: space-between; margin-bottom: 32px;">
              <div style="flex:1 1 220px; min-width:220px;">
                <h2 class="about-subtitle" style="color: var(--primary-color); font-size:1.3rem; margin-bottom: 12px;">Fitur Utama</h2>
                <ul class="about-features" style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;">📸 <b>Berbagi cerita dengan foto</b></li>
                  <li style="margin-bottom: 10px;">📍 <b>Tandai lokasi cerita Anda</b></li>
                  <li style="margin-bottom: 10px;">🔍 <b>Temukan cerita dari berbagai tempat</b></li>
                  <li style="margin-bottom: 10px;">👥 <b>Berinteraksi dengan cerita orang lain</b></li>
                </ul>
              </div>
              <div style="flex:2 1 320px; min-width:260px;">
                <h2 class="about-subtitle" style="color: var(--primary-color); font-size:1.3rem; margin-bottom: 12px;">Visi Kami</h2>
                <p class="about-description" style="margin-bottom: 0;">
                  Kami percaya bahwa setiap tempat memiliki cerita uniknya sendiri. StoryApp hadir untuk membantu Anda menangkap momen-momen berharga dan membagikannya dengan dunia, sambil menciptakan peta digital dari kenangan dan pengalaman.
                </p>
              </div>
            </div>
            <div style="margin-top: 24px;">
              <h2 class="about-subtitle" style="color: var(--primary-color); font-size:1.3rem; margin-bottom: 12px;">Tim Kami</h2>
              <div style="display: flex; align-items: center; gap: 18px;">
                <img src="https://ui-avatars.com/api/?name=Gilang+Athaya&background=2980b9&color=fff&size=80" alt="Gilang Athaya" style="border-radius: 50%; width: 64px; height: 64px; box-shadow: var(--shadow);">
                <div>
                  <div style="font-weight: bold; color: var(--secondary-color); font-size:1.1rem;">Gilang Athaya</div>
                  <div style="font-size:0.98rem; color:#666;">Front-end & Back-end Developer</div>
                  <div style="margin-top: 6px; font-size:0.97rem; color:#444;">Dedikasi untuk menciptakan pengalaman berbagi cerita yang lebih bermakna dan inovatif.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },
  async afterRender() {
    // No additional setup needed for about page
  }
};

export default About;