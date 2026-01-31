/* ═══════════════════════════════════════════════════════════════
   VILLA RAFFLE — INTERACTIVE FUNCTIONALITY
   Vanilla JavaScript for gallery, modals, forms, and calculations
   ═══════════════════════════════════════════════════════════════ */

// === CONFIGURATION ===
const CONFIG = {
    PRICE_PER_TICKET: 30, // Updated to $30 per ticket
    TOTAL_TICKETS_AVAILABLE: 200000, // Updated to 200,000 total tickets
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

// === TRUSTPILOT CAROUSEL ===
const CAROUSEL_STATE = {
    currentIndex: 0,
    totalSlides: 0,
    startX: 0,
    currentX: 0,
    isDragging: false,
    startTime: 0,
    translateX: 0
};

function initTrustpilotCarousel() {
    const carousel = document.getElementById('trustpilot-carousel');
    const track = document.getElementById('testimonial-track');
    const dots = document.querySelectorAll('.dot');
    
    if (!carousel || !track || dots.length === 0) return;
    
    // Get total slides
    const cards = track.querySelectorAll('.testimonial-card');
    CAROUSEL_STATE.totalSlides = cards.length;
    
    // Touch/Mouse event handlers
    const handleStart = (e) => {
        CAROUSEL_STATE.isDragging = true;
        CAROUSEL_STATE.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        CAROUSEL_STATE.currentX = CAROUSEL_STATE.startX;
        CAROUSEL_STATE.startTime = Date.now();
        
        track.classList.add('no-transition');
    };
    
    const handleMove = (e) => {
        if (!CAROUSEL_STATE.isDragging) return;
        
        e.preventDefault();
        CAROUSEL_STATE.currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        
        const diff = CAROUSEL_STATE.currentX - CAROUSEL_STATE.startX;
        const cardWidth = cards[0].offsetWidth + 16; // card width + gap
        const baseTranslate = -CAROUSEL_STATE.currentIndex * cardWidth;
        
        CAROUSEL_STATE.translateX = baseTranslate + diff;
        track.style.transform = `translateX(${CAROUSEL_STATE.translateX}px)`;
    };
    
    const handleEnd = () => {
        if (!CAROUSEL_STATE.isDragging) return;
        
        CAROUSEL_STATE.isDragging = false;
        track.classList.remove('no-transition');
        
        const diff = CAROUSEL_STATE.currentX - CAROUSEL_STATE.startX;
        const timeDiff = Date.now() - CAROUSEL_STATE.startTime;
        const velocity = Math.abs(diff) / timeDiff;
        
        // Determine if swipe was significant
        const threshold = 50;
        const velocityThreshold = 0.3;
        
        if (Math.abs(diff) > threshold || velocity > velocityThreshold) {
            if (diff > 0 && CAROUSEL_STATE.currentIndex > 0) {
                // Swipe right - previous slide
                CAROUSEL_STATE.currentIndex--;
            } else if (diff < 0 && CAROUSEL_STATE.currentIndex < CAROUSEL_STATE.totalSlides - 1) {
                // Swipe left - next slide
                CAROUSEL_STATE.currentIndex++;
            }
        }
        
        updateCarousel();
    };
    
    // Add event listeners
    track.addEventListener('mousedown', handleStart);
    track.addEventListener('mousemove', handleMove);
    track.addEventListener('mouseup', handleEnd);
    track.addEventListener('mouseleave', handleEnd);
    
    track.addEventListener('touchstart', handleStart, { passive: false });
    track.addEventListener('touchmove', handleMove, { passive: false });
    track.addEventListener('touchend', handleEnd);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            CAROUSEL_STATE.currentIndex = index;
            updateCarousel();
        });
    });
    
    // Update carousel position and dots
    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth + 16; // card width + gap
        const translateX = -CAROUSEL_STATE.currentIndex * cardWidth;
        
        track.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            if (index === CAROUSEL_STATE.currentIndex) {
                dot.classList.add('dot--active');
            } else {
                dot.classList.remove('dot--active');
            }
        });
        
        // Track analytics
        trackEvent('testimonial_view', { 
            index: CAROUSEL_STATE.currentIndex 
        });
    }
    
    // Handle scroll-based visibility
    function handleCarouselScroll() {
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;
        
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        // Fade out when user scrolls past hero section
        if (window.scrollY > heroBottom - 200) {
            carousel.classList.add('hidden');
        } else {
            carousel.classList.remove('hidden');
        }
    }
    
    // Throttle scroll handler for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            handleCarouselScroll();
        });
    });
    
    // Initial position
    updateCarousel();
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
