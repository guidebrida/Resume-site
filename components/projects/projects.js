// Carousel functionality for projects
class ProjectCarousel {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelectorAll('.carousel-slide');
        this.indicators = container.querySelectorAll('.indicator');
        this.prevBtn = container.querySelector('.prev-btn');
        this.nextBtn = container.querySelector('.next-btn');
        this.currentSlide = 0;

        this.init();
    }

    init() {
        // Show initial slide
        this.showSlide(this.currentSlide);

        // Event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.showSlide(index));
        });

        // Keyboard support
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch support for mobile
        this.setupTouchEvents();
    }

    showSlide(index) {
        // Ensure index is within bounds
        if (index < 0) {
            index = this.slides.length - 1;
        } else if (index >= this.slides.length) {
            index = 0;
        }

        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Update indicators
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });

        // Show current slide
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');

        // Update current indicator
        if (this.indicators[this.currentSlide]) {
            this.indicators[this.currentSlide].classList.add('active');
        }
    }

    nextSlide() {
        let nextIndex = this.currentSlide + 1;
        if (nextIndex >= this.slides.length) {
            nextIndex = 0;
        }
        this.showSlide(nextIndex);
    }

    prevSlide() {
        let prevIndex = this.currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = this.slides.length - 1;
        }
        this.showSlide(prevIndex);
    }

    setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const minSwipeDistance = 50;

        if (startX - endX > minSwipeDistance) {
            // Swipe left - next slide
            this.nextSlide();
        } else if (endX - startX > minSwipeDistance) {
            // Swipe right - previous slide
            this.prevSlide();
        }
    }
}

// Initialize carousels when page loads
function initCarousels() {
    const carouselContainers = document.querySelectorAll('.carousel-container');

    carouselContainers.forEach(container => {
        new ProjectCarousel(container);
    });

    // Make controls keyboard accessible
    document.querySelectorAll('.carousel-btn, .indicator').forEach(btn => {
        btn.setAttribute('tabindex', '0');
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
} else {
    initCarousels();
}