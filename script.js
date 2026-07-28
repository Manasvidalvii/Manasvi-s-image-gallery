// DOM Elements Selection
const filterBtns = document.querySelectorAll('.pill');
const cards = document.querySelectorAll('.card');
const searchInput = document.getElementById('search-input');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('lightbox-close');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const imageCounter = document.getElementById('image-counter');

// Load Liked Image IDs from LocalStorage
let favorites = JSON.parse(localStorage.getItem('my_gallery_favs')) || [];
let activeCategory = 'all';
let searchQuery = '';
let visibleCards = Array.from(cards);
let currentIndex = 0;

// Initialize Heart States
cards.forEach(card => {
    const cardId = card.dataset.id;
    const likeBtn = card.querySelector('.like-btn');

    if (favorites.includes(cardId)) {
        likeBtn.classList.add('liked');
        likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    }

    // Toggle Favorites Handler
    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents opening the lightbox when clicking the heart
        toggleFavorite(cardId, likeBtn);
    });
});

function toggleFavorite(id, btn) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        btn.classList.remove('liked');
        btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    } else {
        favorites.push(id);
        btn.classList.add('liked');
        btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    }
    localStorage.setItem('my_gallery_favs', JSON.stringify(favorites));
    applyFilters();
}

// Global Filter & Search Logic
function applyFilters() {
    cards.forEach(card => {
        const category = card.dataset.category;
        const cardId = card.dataset.id;
        const altText = card.querySelector('img').alt.toLowerCase();

        const matchesCategory = 
            activeCategory === 'all' ? true :
            activeCategory === 'favorites' ? favorites.includes(cardId) :
            category === activeCategory;

        const matchesSearch = altText.includes(searchQuery) || category.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
            card.classList.remove('hide');
        } else {
            card.classList.add('hide');
        }
    });

    visibleCards = Array.from(cards).filter(card => !card.classList.contains('hide'));
}

// Category Pills Handler
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.filter;
        applyFilters();
    });
});

// Live Search Input Handler
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    applyFilters();
});

// Lightbox Modal Functions
cards.forEach(card => {
    card.addEventListener('click', () => {
        currentIndex = visibleCards.indexOf(card);
        if (currentIndex !== -1) {
            updateLightbox();
            lightbox.classList.add('active');
        }
    });
});

function updateLightbox() {
    const currentCard = visibleCards[currentIndex];
    const imgElement = currentCard.querySelector('img');
    lightboxImg.src = imgElement.src;
    imageCounter.innerText = `${currentIndex + 1} / ${visibleCards.length}`;
}

// Next / Previous Handlers
prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
    updateLightbox();
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % visibleCards.length;
    updateLightbox();
});

closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

// Keyboard Nav Support
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
});

// Initial Setup
applyFilters();