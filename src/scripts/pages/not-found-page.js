class NotFoundPage {
  constructor() {
  }

  async render() {
    return `
      <section class="container">
        <h1>404 - Halaman Tidak Ditemukan</h1>
        <p>Maaf, halaman yang Anda cari tidak ditemukan.</p>
      </section>
    `;
  }

  async afterRender() {
    //Note: bisa diisi dengan logic untuk menampilkan animasi atau efek lainnya (kalau inget)
  }
}

export default new NotFoundPage(); 