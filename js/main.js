document.addEventListener('DOMContentLoaded', () => {
  fetchBerita('terbaru');
});

function fetchBerita(kategori) {
  fetch(`https://api-berita-indonesia.vercel.app/antara/${kategori}`)
    .then(response => response.json())
    .then(data => {
      const allPosts = data.data.posts;
      const headline = allPosts[0];
      const terpopuler = allPosts.slice(1, 4);
      const lainnya = allPosts.slice(4);

      renderHeadline(headline);
      renderTerpopuler(terpopuler);
      renderLainnya(lainnya);
    })
    .catch(err => console.error('Gagal fetch:', err));
}

function simpanDetail(berita) {
  localStorage.setItem('berita-detail', JSON.stringify(berita));
}

function buatKartuBerita(berita) {
  const card = document.createElement('div');
  card.className = "bg-white p-4 rounded shadow hover:shadow-lg transition";
  card.innerHTML = `
    <img src="${berita.thumbnail || 'https://via.placeholder.com/300x200'}" class="w-full h-40 object-cover rounded mb-3">
    <h3 class="font-semibold text-lg">${berita.title}</h3>
    <p class="text-sm text-gray-500 mb-2">${berita.pubDate}</p>
    <a href="detail.html" class="text-blue-600 text-sm hover:underline">Baca Selengkapnya →</a>
  `;
  card.querySelector('a').addEventListener('click', () => simpanDetail(berita));
  return card;
}

function renderHeadline(berita) {
  const container = document.getElementById('headline-container');
  container.innerHTML = `
    <div class="relative bg-cover bg-center h-64 rounded-lg shadow-lg overflow-hidden"
         style="background-image: url('${berita.thumbnail || 'https://via.placeholder.com/800x400'}')">
      <div class="absolute inset-0 bg-black bg-opacity-50 p-6 flex flex-col justify-end">
        <h2 class="text-white text-2xl font-bold">${berita.title}</h2>
        <p class="text-sm text-gray-200">${berita.pubDate}</p>
        <a href="detail.html" class="text-yellow-300 mt-2 text-sm hover:underline">Baca Selengkapnya</a>
      </div>
    </div>
  `;
  container.querySelector('a').addEventListener('click', () => simpanDetail(berita));
}

function renderTerpopuler(list) {
  const container = document.getElementById('terpopuler-container');
  container.innerHTML = '';
  list.forEach(item => {
    const card = buatKartuBerita(item);
    container.appendChild(card);
  });
}

function renderLainnya(list) {
  const container = document.getElementById('berita-container');
  container.innerHTML = '';
  list.forEach(item => {
    const card = buatKartuBerita(item);
    container.appendChild(card);
  });
}

document.querySelectorAll('.kategori-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const kategori = e.target.dataset.kategori;
    fetchBerita(kategori);

    document.querySelectorAll('.kategori-link').forEach(el => {
      el.classList.remove('text-yellow-300', 'font-semibold');
    });
    e.target.classList.add('text-yellow-300', 'font-semibold');
  });
});
