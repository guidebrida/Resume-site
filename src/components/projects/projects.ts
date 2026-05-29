class ProjectCarousel {
    private readonly container: HTMLElement;
    private readonly slides: NodeListOf<HTMLElement>;
    private readonly indicators: NodeListOf<HTMLElement>;
    private readonly prevBtn: HTMLElement | null;
    private readonly nextBtn: HTMLElement | null;
    private currentSlide: number = 0;

    constructor(container: HTMLElement) {
        this.container = container;
        this.slides = container.querySelectorAll<HTMLElement>('.carousel-slide');
        this.indicators = container.querySelectorAll<HTMLElement>('.indicator');
        this.prevBtn = container.querySelector<HTMLElement>('.prev-btn');
        this.nextBtn = container.querySelector<HTMLElement>('.next-btn');

        this.init();
    }

    private init(): void {
        this.showSlide(this.currentSlide);

        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.showSlide(index));
        });

        this.container.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        this.setupTouchEvents();
    }

    private showSlide(index: number): void {
        // Wrap around
        if (index < 0) {
            index = this.slides.length - 1;
        } else if (index >= this.slides.length) {
            index = 0;
        }

        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));

        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide]?.classList.add('active');
    }

    private nextSlide(): void {
        this.showSlide(this.currentSlide + 1);
    }

    private prevSlide(): void {
        this.showSlide(this.currentSlide - 1);
    }

    private setupTouchEvents(): void {
        let touchStartX = 0;

        this.container.addEventListener('touchstart', (e: TouchEvent) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    private handleSwipe(startX: number, endX: number): void {
        const MIN_SWIPE_DISTANCE = 50;

        if (startX - endX > MIN_SWIPE_DISTANCE) {
            this.nextSlide();
        } else if (endX - startX > MIN_SWIPE_DISTANCE) {
            this.prevSlide();
        }
    }
}

function initCarousels(): void {
    const containers = document.querySelectorAll<HTMLElement>('.carousel-container');
    containers.forEach(container => new ProjectCarousel(container));

    document.querySelectorAll<HTMLElement>('.carousel-btn, .indicator').forEach(btn => {
        btn.setAttribute('tabindex', '0');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
} else {
    initCarousels();
}
