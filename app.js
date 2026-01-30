/* ═══════════════════════════════════════════════════════════════
   VILLA RAFFLE — INTERACTIVE FUNCTIONALITY
   Vanilla JavaScript for gallery, modals, forms, and calculations
   ═══════════════════════════════════════════════════════════════ */

// === CONFIGURATION ===
const CONFIG = {
    PRICE_PER_TICKET: 50, // Change this to update ticket price globally
    TOTAL_TICKETS_AVAILABLE: 50000, // Update with actual total
    STRIPE_PAYMENT_LINK: 'https://buy.stripe.com/cNi7sL9xtfGR5X532Y2Fa05'
};

// === DOM ELEMENTS ===
const DOM = {
    // Hero
    heroCTA: document.getElementById('hero-cta'),
    finalCTABtn: document.getElementById('final-cta-btn'),
    
    // Gallery
    galleryTabs: document.querySelectorAll('.gallery__tab'),
    galleryGrids: document.querySelectorAll('.gallery__grid'),
    galleryItems: document.querySelectorAll('.gallery__item'),
    
    // Ticket Modal
    ticketModal: document.getElementById('ticket-modal'),
    ticketOptions: document.querySelectorAll('.ticket-option'),
    customTicketsInput: document.getElementById('custom-tickets'),
    selectedCount: document.getElementById('selected-count'),
    totalPrice: document.getElementById('total-price'),
    checkoutBtn: document.getElementById('checkout-btn'),
    modalClose: document.querySelector('.modal__close'),
    modalOverlay: document.querySelector('.modal__overlay'),
    
    // Lightbox
    lightbox: document.getElementById('lightbox'),
    lightboxImage: document.getElementById('lightbox-image'),
    lightboxLabel: document.getElementById('lightbox-label'),
    lightboxClose: document.querySelector('.lightbox__close'),
    lightboxOverlay: document.querySelector('.lightbox__overlay'),
    lightboxPrev: document.querySelector('.lightbox__nav--prev'),
    lightboxNext: document.querySelector('.lightbox__nav--next'),
    
    // Odds Calculator
    yourTicketsInput: document.getElementById('your-tickets'),
    totalSoldInput: document.getElementById('total-sold'),
    oddsResult: document.getElementById('odds-result'),
    
    // FAQ
    faqQuestions: document.querySelectorAll('.faq__question')
};

// === STATE ===
const STATE = {
    selectedTickets: 1,
    currentLightboxIndex: 0,
    lightboxImages: []
};

// === GALLERY FUNCTIONALITY ===
function initGallery() {
    // Tab switching
    DOM.galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            DOM.galleryTabs.forEach(t => t.classList.remove('gallery__tab--active'));
            tab.classList.add('gallery__tab--active');
            
            // Update active grid
            DOM.galleryGrids.forEach(grid => {
                grid.classList.remove('gallery__grid--active');
                if (grid.dataset.content === targetTab) {
                    grid.classList.add('gallery__grid--active');
                }
            });
        });
    });
    
    // Lightbox functionality
    DOM.galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const imageSrc = item.dataset.image;
            const label = item.querySelector('.gallery__label').textContent;
            
            // Build lightbox images array from current visible gallery
            const activeGrid = document.querySelector('.gallery__grid--active');
            STATE.lightboxImages = Array.from(activeGrid.querySelectorAll('.gallery__item')).map(item => ({
                src: item.dataset.image,
                label: item.querySelector('.gallery__label').textContent
            }));
            
            STATE.currentLightboxIndex = STATE.lightboxImages.findIndex(img => img.src === imageSrc);
            
            openLightbox();
        });
    });
}

function openLightbox() {
    const currentImage = STATE.lightboxImages[STATE.currentLightboxIndex];
    DOM.lightboxImage.src = currentImage.src;
    DOM.lightboxLabel.textContent = currentImage.label;
    DOM.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    DOM.lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function nextLightboxImage() {
    STATE.currentLightboxIndex = (STATE.currentLightboxIndex + 1) % STATE.lightboxImages.length;
    const currentImage = STATE.lightboxImages[STATE.currentLightboxIndex];
    DOM.lightboxImage.src = currentImage.src;
    DOM.lightboxLabel.textContent = currentImage.label;
}

function prevLightboxImage() {
    STATE.currentLightboxIndex = (STATE.currentLightboxIndex - 1 + STATE.lightboxImages.length) % STATE.lightboxImages.length;
    const currentImage = STATE.lightboxImages[STATE.currentLightboxIndex];
    DOM.lightboxImage.src = currentImage.src;
    DOM.lightboxLabel.textContent = currentImage.label;
}

// === TICKET MODAL FUNCTIONALITY ===
function openTicketModal() {
    DOM.ticketModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateTicketSummary();
}

function closeTicketModal() {
    DOM.ticketModal.classList.remove('active');
    document.body.style.overflow = '';
}

function updateTicketSummary() {
    DOM.selectedCount.textContent = STATE.selectedTickets;
    const total = STATE.selectedTickets * CONFIG.PRICE_PER_TICKET;
    DOM.totalPrice.textContent = `$${total.toLocaleString()}`;
    
    // Update checkout link (this is a fallback - see notes in HTML for dynamic implementation)
    // For production, implement server-side Checkout Session creation
    DOM.checkoutBtn.href = CONFIG.STRIPE_PAYMENT_LINK;
}

function initTicketModal() {
    // CTA buttons
    DOM.heroCTA?.addEventListener('click', openTicketModal);
    DOM.finalCTABtn?.addEventListener('click', openTicketModal);
    
    // Close modal
    DOM.modalClose?.addEventListener('click', closeTicketModal);
    DOM.modalOverlay?.addEventListener('click', closeTicketModal);
    
    // Ticket option selection
    DOM.ticketOptions.forEach(option => {
        option.addEventListener('click', () => {
            const tickets = parseInt(option.dataset.tickets);
            STATE.selectedTickets = tickets;
            
            // Update UI
            DOM.ticketOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            // Clear custom input
            if (DOM.customTicketsInput) {
                DOM.customTicketsInput.value = '';
            }
            
            updateTicketSummary();
        });
    });
    
    // Custom ticket input
    if (DOM.customTicketsInput) {
        DOM.customTicketsInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 1;
            const clampedValue = Math.max(1, Math.min(1000, value));
            STATE.selectedTickets = clampedValue;
            
            // Deselect preset options
            DOM.ticketOptions.forEach(opt => opt.classList.remove('selected'));
            
            updateTicketSummary();
        });
    }
    
    // Initialize with 1 ticket selected
    if (DOM.ticketOptions.length > 0) {
        DOM.ticketOptions[0].classList.add('selected');
    }
}

// === ODDS CALCULATOR ===
function calculateOdds() {
    const yourTickets = parseInt(DOM.yourTicketsInput?.value) || 1;
    const totalSold = parseInt(DOM.totalSoldInput?.value) || CONFIG.TOTAL_TICKETS_AVAILABLE;
    
    if (yourTickets > 0 && totalSold > 0) {
        const odds = Math.round(totalSold / yourTickets);
        DOM.oddsResult.textContent = `1 in ${odds.toLocaleString()}`;
    }
}

function initOddsCalculator() {
    if (DOM.yourTicketsInput) {
        DOM.yourTicketsInput.addEventListener('input', calculateOdds);
    }
    
    // Calculate initial odds
    calculateOdds();
}

// === FAQ ACCORDION ===
function initFAQ() {
    DOM.faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// === LAZY LOAD IMAGES ===
function initLazyLoad() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const imageSrc = item.dataset.image;
                
                // Create actual image element
                const img = document.createElement('img');
                img.src = imageSrc;
                img.alt = item.querySelector('.gallery__label')?.textContent || 'Villa image';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                
                img.onload = () => {
                    item.querySelector('.gallery__placeholder').style.display = 'none';
                    item.appendChild(img);
                };
                
                img.onerror = () => {
                    // Keep placeholder if image fails to load
                    console.warn(`Failed to load image: ${imageSrc}`);
                };
                
                observer.unobserve(item);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    DOM.galleryItems.forEach(item => {
        imageObserver.observe(item);
    });
}

// === HERO BACKGROUND LAZY LOAD ===
function initHeroBackground() {
    const heroBg = document.querySelector('.hero__video-bg');
    if (heroBg) {
        const img = new Image();
        img.src = 'assets/hero_bg.jpg';
        img.onload = () => {
            heroBg.style.backgroundImage = `url('assets/hero_bg.jpg')`;
        };
    }
}

// === KEYBOARD NAVIGATION ===
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // Close modals with Escape
        if (e.key === 'Escape') {
            if (DOM.lightbox.classList.contains('active')) {
                closeLightbox();
            }
            if (DOM.ticketModal.classList.contains('active')) {
                closeTicketModal();
            }
        }
        
        // Lightbox navigation with arrow keys
        if (DOM.lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                prevLightboxImage();
            }
            if (e.key === 'ArrowRight') {
                nextLightboxImage();
            }
        }
    });
}

// === LIGHTBOX EVENT LISTENERS ===
function initLightboxEvents() {
    DOM.lightboxClose?.addEventListener('click', closeLightbox);
    DOM.lightboxOverlay?.addEventListener('click', closeLightbox);
    DOM.lightboxPrev?.addEventListener('click', prevLightboxImage);
    DOM.lightboxNext?.addEventListener('click', nextLightboxImage);
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('.gallery, .dream, .how-it-works, .odds, .timeline, .social-proof, .faq');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
}

// === WINNERS CAROUSEL (Basic) ===
function initCarousel() {
    const prevBtn = document.querySelector('.carousel__nav--prev');
    const nextBtn = document.querySelector('.carousel__nav--next');
    const track = document.querySelector('.winners__track');
    
    if (!track) return;
    
    let currentIndex = 0;
    const cards = track.querySelectorAll('.winner__card');
    const cardWidth = cards[0]?.offsetWidth || 0;
    const visibleCards = Math.floor(track.offsetWidth / cardWidth);
    const maxIndex = Math.max(0, cards.length - visibleCards);
    
    // Show nav buttons only if needed
    if (cards.length > visibleCards) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
    }
    
    const updateCarousel = () => {
        const offset = -currentIndex * (cardWidth + 24); // 24 = gap
        track.style.transform = `translateX(${offset}px)`;
        track.style.transition = 'transform 0.5s ease-out';
    };
    
    prevBtn?.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateCarousel();
    });
    
    nextBtn?.addEventListener('click', () => {
        currentIndex = Math.min(maxIndex, currentIndex + 1);
        updateCarousel();
    });
}

// === TRUSTPILOT HERO CAROUSEL ===
function initTrustpilotCarousel() {
    const carousel = document.querySelector('.trustpilot-carousel');
    const heroSection = document.getElementById('hero');
    if (!carousel) return;

    const track = carousel.querySelector('.trustpilot-carousel__track');
    const cards = Array.from(carousel.querySelectorAll('.trustpilot-carousel__card'));
    const dots = Array.from(carousel.querySelectorAll('.trustpilot-carousel__dot'));

    if (!track || cards.length === 0) return;

    let activeIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const updateSlide = () => {
        track.style.transform = `translateX(-${activeIndex * 100}%)`;
        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-pressed', String(isActive));
        });
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            activeIndex = index;
            updateSlide();
        });
    });

    const handlePointerDown = (event) => {
        startX = event.clientX;
        currentX = startX;
        isDragging = true;
        track.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event) => {
        if (!isDragging) return;
        currentX = event.clientX;
    };

    const handlePointerUp = (event) => {
        if (!isDragging) return;
        const diff = currentX - startX;
        if (Math.abs(diff) > 40) {
            if (diff < 0 && activeIndex < cards.length - 1) {
                activeIndex += 1;
            }
            if (diff > 0 && activeIndex > 0) {
                activeIndex -= 1;
            }
        }
        track.releasePointerCapture?.(event.pointerId);
        updateSlide();
        isDragging = false;
    };

    track.addEventListener('pointerdown', handlePointerDown);
    track.addEventListener('pointermove', handlePointerMove);
    track.addEventListener('pointerup', handlePointerUp);
    track.addEventListener('pointercancel', handlePointerUp);
    track.addEventListener('pointerleave', handlePointerUp);

    if (heroSection && 'IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                carousel.classList.toggle('trustpilot-carousel--hidden', !entry.isIntersecting);
            });
        }, { threshold: 0.15 });
        heroObserver.observe(heroSection);
    }

    updateSlide();
}

// === ANALYTICS TRACKING (Placeholder) ===
function trackEvent(eventName, eventData = {}) {
    // TODO: Integrate with your analytics provider (GA4, Mixpanel, etc.)
    console.log('Event tracked:', eventName, eventData);
    
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, eventData);
    // }
}

// Track important user actions
function initAnalytics() {
    // Track CTA clicks
    DOM.heroCTA?.addEventListener('click', () => {
        trackEvent('cta_click', { location: 'hero' });
    });
    
    DOM.finalCTABtn?.addEventListener('click', () => {
        trackEvent('cta_click', { location: 'final' });
    });
    
    // Track ticket selection
    DOM.ticketOptions.forEach(option => {
        option.addEventListener('click', () => {
            trackEvent('ticket_selected', { 
                count: option.dataset.tickets 
            });
        });
    });
    
    // Track checkout click
    DOM.checkoutBtn?.addEventListener('click', () => {
        trackEvent('checkout_click', { 
            tickets: STATE.selectedTickets,
            amount: STATE.selectedTickets * CONFIG.PRICE_PER_TICKET
        });
    });
}

// === INITIALIZATION ===
function init() {
    console.log('Villa Raffle initialized');
    
    // Initialize all features
    initGallery();
    initTicketModal();
    initOddsCalculator();
    initFAQ();
    initSmoothScroll();
    initLazyLoad();
    initHeroBackground();
    initKeyboardNav();
    initLightboxEvents();
    initScrollAnimations();
    initCarousel();
    initTrustpilotCarousel();
    initAnalytics();
    
    console.log('✓ All features loaded');
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// === EXPORTS (for potential module usage) ===
window.VillaRaffle = {
    openTicketModal,
    closeTicketModal,
    trackEvent,
    CONFIG
};
