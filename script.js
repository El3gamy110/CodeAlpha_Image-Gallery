// Image Data
const galleryData = [
    {
        id: 1,
        title: "tranquil river",
        category: "nature",
        src: "https://images.pexels.com/photos/13248795/pexels-photo-13248795.jpeg"
    },
    {
        id: 2,
        title: "the Emirates Tower",
        category: "architecture",
        src: "https://images.pexels.com/photos/19457826/pexels-photo-19457826.jpeg"
    },
    {
        id: 3,
        title: "Majestic Tiger",
        category: "animals",
        src: "https://images.pexels.com/photos/27834731/pexels-photo-27834731.jpeg"
    },
    {
        id: 4,
        title: "Mona Lisa",
        category: "Art",
        src: "https://images.pexels.com/photos/32381462/pexels-photo-32381462.jpeg"
    },
    {
        id: 5,
        title: "Autumn Forest Trail",
        category: "nature",
        src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        title: "Ancient Egyptian Temple",
        category: "architecture",
        src: "https://images.pexels.com/photos/21348185/pexels-photo-21348185.jpeg"
    },
    {
        id: 7,
        title: "Curious Fox",
        category: "animals",
        src: "https://images.pexels.com/photos/23914490/pexels-photo-23914490.jpeg"
    },
    {
        id: 8,
        title: "Starry Night",
        category: "Art",
        src: "https://images.pexels.com/photos/38075662/pexels-photo-38075662.jpeg"
    }
];

// DOM Elements
const galleryGrid = document.getElementById('gallery-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxNext = document.querySelector('.lightbox-nav.next');
const lightboxPrev = document.querySelector('.lightbox-nav.prev');
const lightboxOverlay = document.querySelector('.lightbox-overlay');

// State variables
let currentFilteredData = [...galleryData];
let currentLightboxIndex = 0;

// Initialize Gallery
function initGallery() {
    renderGallery(galleryData);
    setupFilterListeners();
    setupLightboxListeners();
}

// Render Gallery Items
function renderGallery(data) {
    galleryGrid.innerHTML = '';
    
    data.forEach((item, index) => {
        const article = document.createElement('article');
        article.className = 'gallery-item';
        article.setAttribute('data-id', item.id);
        article.setAttribute('data-index', index);
        
        // Add staggered animation delay
        article.style.animationDelay = `${index * 0.05}s`;

        article.innerHTML = `
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            <div class="item-info">
                <h3 class="item-title">${item.title}</h3>
                <span class="item-category">${item.category}</span>
            </div>
        `;
        
        // Open lightbox on click
        article.addEventListener('click', () => openLightbox(index));
        
        galleryGrid.appendChild(article);
    });
}

// Filter Logic
function setupFilterListeners() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            e.target.classList.add('active');
            
            const filterValue = e.target.getAttribute('data-filter');
            
            if (filterValue === 'all') {
                currentFilteredData = [...galleryData];
            } else {
                currentFilteredData = galleryData.filter(item => item.category === filterValue);
            }
            
            renderGallery(currentFilteredData);
        });
    });
}

// Lightbox Logic
function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.classList.remove('loaded');
}

function updateLightboxContent() {
    const item = currentFilteredData[currentLightboxIndex];
    if (!item) return;
    
    // Reset loaded state for smooth transition
    lightboxImg.classList.remove('loaded');
    
    // Set new source and caption
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxCaption.textContent = `${item.title} — ${item.category}`;
    
    // Add loaded class when image finishes loading
    lightboxImg.onload = () => {
        lightboxImg.classList.add('loaded');
    };
}

function navigateLightbox(direction) {
    if (direction === 'next') {
        currentLightboxIndex = (currentLightboxIndex + 1) % currentFilteredData.length;
    } else if (direction === 'prev') {
        currentLightboxIndex = (currentLightboxIndex - 1 + currentFilteredData.length) % currentFilteredData.length;
    }
    updateLightboxContent();
}

function setupLightboxListeners() {
    // Close buttons
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    
    // Navigation buttons
    lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox('next');
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
    });
}

// Start the application
initGallery();
