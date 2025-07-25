/**
 * Generic Presentation Engine for Educational Web Pages
 * Transforms any HTML page into a PowerPoint-style presentation
 * 
 * Features:
 * - Auto-detect slides based on data attributes or CSS selectors
 * - Keyboard navigation (arrows, space, page up/down, home/end, esc)
 * - Progress bar and slide counter
 * - Theme-aware styling
 * - State persistence and URL updates
 * - Code block copy functionality preservation
 */

class PresentationEngine {
    constructor(config = {}) {
        // Configuration with defaults
        this.config = {
            slideSelector: '[data-slide]', // Changed default to prioritize data-slide
            excludeSelector: '.lesson-nav, .header, .footer',
            autoDetect: true,
            keyboardControls: true,
            progressBar: true,
            slideCounter: true,
            localStorageKey: 'presentation-last-slide',
            urlHashPrefix: 'slide-',
            ...config
        };
        
        // State management
        this.slides = [];
        this.currentSlide = 0;
        this.isPresenting = false;
        this.originalScrollPosition = 0;
        this.originalHash = '';
        
        // DOM elements (will be created)
        this.presentationUI = null;
        this.progressBar = null;
        this.slideCounter = null;
        this.exitButton = null;
        
        // Bind methods to preserve context
        this.handleKeyboard = this.handleKeyboard.bind(this);
        this.handleHashChange = this.handleHashChange.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    /**
     * Initialize the presentation engine
     */
    init() {
        try {
            this.detectSlides();
            this.createPresentationButton();
            this.setupEventListeners();
            this.loadLastSlidePosition();
            
            console.log(`PresentationEngine initialized with ${this.slides.length} slides`);
        } catch (error) {
            console.error('Failed to initialize PresentationEngine:', error);
        }
    }
    
    /**
     * Auto-detect slides based on configuration
     */
    detectSlides() {
        this.slides = [];
        
        // First, look for elements with data-slide attributes (priority)
        const dataSlideElements = document.querySelectorAll('[data-slide]');
        const slideMap = new Map();
        
        console.log('Found data-slide elements:', dataSlideElements.length);
        
        dataSlideElements.forEach(element => {
            // Skip excluded elements
            if (this.config.excludeSelector && element.matches(this.config.excludeSelector)) {
                return;
            }
            
            // Skip if element is inside an excluded parent
            if (this.config.excludeSelector && element.closest(this.config.excludeSelector)) {
                return;
            }
            
            const slideNum = parseInt(element.getAttribute('data-slide'));
            console.log(`Processing element with data-slide="${slideNum}":`, element);
            
            if (!isNaN(slideNum) && slideNum > 0) {
                slideMap.set(slideNum, element);
            }
        });
        
        // If we have data-slide elements, use only those
        if (slideMap.size > 0) {
            // Sort by slide number and create slides array
            const sortedSlideNumbers = Array.from(slideMap.keys()).sort((a, b) => a - b);
            
            sortedSlideNumbers.forEach((slideNum, index) => {
                const element = slideMap.get(slideNum);
                let title = element.getAttribute('data-slide-title');
                
                if (!title) {
                    // Try to find title from heading elements
                    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
                    if (heading) {
                        title = heading.textContent.trim();
                    } else {
                        // Try to get title from class or other attributes
                        const classList = Array.from(element.classList);
                        title = classList.find(cls => cls !== 'data-type-card') || `Slide ${index + 1}`;
                    }
                }
                
                this.slides.push({
                    element: element,
                    title: title,
                    index: index,
                    id: `slide-${index + 1}`
                });
            });
            
            console.log('Detected slides:', this.slides.map(s => ({ title: s.title, element: s.element })));
        } else {
            // Fallback to selector-based detection
            const slideElements = document.querySelectorAll(this.config.slideSelector);
            
            slideElements.forEach((element, index) => {
                // Skip excluded elements
                if (this.config.excludeSelector && element.matches(this.config.excludeSelector)) {
                    return;
                }
                
                // Skip if element is inside an excluded parent
                if (this.config.excludeSelector && element.closest(this.config.excludeSelector)) {
                    return;
                }
                
                // Determine slide title
                let title = element.getAttribute('data-slide-title');
                if (!title) {
                    // Try to find title from heading elements
                    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
                    title = heading ? heading.textContent.trim() : `Slide ${this.slides.length + 1}`;
                }
                
                this.slides.push({
                    element: element,
                    title: title,
                    index: this.slides.length,
                    id: `slide-${this.slides.length + 1}`
                });
            });
        }
    }
    
    /**
     * Create the presentation mode button in the header
     */
    createPresentationButton() {
        const header = document.querySelector('.header, .header-top, header');
        if (!header) {
            console.warn('No header found to add presentation button');
            return;
        }
        
        const button = document.createElement('button');
        button.className = 'presentation-mode-btn';
        button.innerHTML = '🧑‍🏫';
        button.title = 'Enter Presentation Mode';
        button.style.cssText = `
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: var(--text-primary, #fff);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 30px;
            right: 85px;
            z-index: 1000;
        `;
        
        // Add hover effects
        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(255,255,255,0.2)';
            button.style.transform = 'scale(1.1)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.background = 'rgba(255,255,255,0.1)';
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', () => this.enterPresentation()); // Keep current behavior
        
        // Append to header (positioned absolutely, so placement doesn't matter)
        header.appendChild(button);
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Hash change for URL-based navigation
        window.addEventListener('hashchange', this.handleHashChange);
        
        // Window resize for responsive updates
        window.addEventListener('resize', this.handleResize);
        
        // Global keyboard shortcuts for presentation
        document.addEventListener('keydown', (event) => {
            // Only handle if not already in presentation mode
            if (!this.isPresenting) {
                if (event.key === 'F5') {
                    event.preventDefault();
                    if (event.shiftKey) {
                        // Shift+F5: Start from last viewed slide
                        this.enterPresentation();
                    } else {
                        // F5: Start from beginning
                        this.enterPresentation(0);
                    }
                }
            }
        });
    }
    
    /**
     * Enter presentation mode
     */
    enterPresentation(slideNumber = null) {
        if (this.isPresenting || this.slides.length === 0) {
            console.log('Cannot enter presentation:', { isPresenting: this.isPresenting, slidesLength: this.slides.length });
            return;
        }
        
        console.log('Entering presentation mode...');
        
        try {
            // Save current state
            this.originalScrollPosition = window.pageYOffset;
            this.originalHash = window.location.hash;
            
            // Set initial slide
            if (slideNumber !== null && slideNumber >= 0 && slideNumber < this.slides.length) {
                // Explicit slide number provided (e.g., from F5)
                this.currentSlide = slideNumber;
            } else {
                // Default behavior: restore last position or start from beginning
                const savedSlide = this.loadLastSlidePosition();
                this.currentSlide = savedSlide !== null ? savedSlide : 0;
            }
            
            console.log('Starting with slide:', this.currentSlide);
            
            // Apply presentation mode
            document.body.classList.add('presentation-mode');
            document.documentElement.classList.add('presentation-mode');
            
            // Hide course navigation elements
            this.hideCourseNavigation();
            
            console.log('Added presentation-mode classes');
            
            // Create presentation UI
            this.createPresentationUI();
            
            // Setup keyboard controls
            if (this.config.keyboardControls) {
                document.addEventListener('keydown', this.handleKeyboard);
            }
            
            this.isPresenting = true;
            
            // Prevent scrolling
            document.body.style.overflow = 'hidden';
            
            console.log('About to show slide:', this.currentSlide);
            
            // Show initial slide
            this.showSlide(this.currentSlide);
            
            // Fire event for external listeners
            window.dispatchEvent(new CustomEvent('presentationModeEntered', {
                detail: { 
                    totalSlides: this.slides.length,
                    currentSlide: this.currentSlide 
                }
            }));
            
            console.log('Presentation mode entered successfully');
            
        } catch (error) {
            console.error('Failed to enter presentation mode:', error);
            this.exitPresentation(); // Cleanup on error
        }
    }
    
    /**
     * Exit presentation mode
     */
    exitPresentation() {
        if (!this.isPresenting) return;
        
        try {
            // Remove presentation mode classes
            document.body.classList.remove('presentation-mode');
            document.documentElement.classList.remove('presentation-mode');

            // Restore course navigation elements
            this.showCourseNavigation();
            
            // Remove keyboard listener
            document.removeEventListener('keydown', this.handleKeyboard);
            
            // Remove presentation UI
            if (this.presentationUI) {
                this.presentationUI.remove();
                this.presentationUI = null;
            }
            // Clear slide title reference
            this.slideTitle = null;

            // Restore scrolling
            document.body.style.overflow = '';
            
            // Show all slides again and restore original styling
            this.slides.forEach(slide => {
                slide.element.classList.remove('active-slide');
                slide.element.style.display = '';
                slide.element.style.position = '';
                slide.element.style.top = '';
                slide.element.style.left = '';
                slide.element.style.width = '';
                slide.element.style.height = '';
                slide.element.style.zIndex = '';
                slide.element.style.padding = '';
                slide.element.style.overflowY = '';
                slide.element.style.background = '';
                slide.element.style.margin = '';
                slide.element.style.borderRadius = '';
                slide.element.style.border = '';
            });
            
            // Restore original scroll position
            window.scrollTo(0, this.originalScrollPosition);
            
            // Restore original hash if it wasn't presentation-related
            if (this.originalHash && !this.originalHash.startsWith('#slide-')) {
                window.location.hash = this.originalHash;
            } else if (window.location.hash.startsWith('#slide-')) {
                history.replaceState(null, null, ' ');
            }
            
            this.isPresenting = false;
            
            // Fire event for external listeners
            window.dispatchEvent(new CustomEvent('presentationModeExited'));
            
        } catch (error) {
            console.error('Failed to exit presentation mode:', error);
        }
    }

    /**
     * Hide course navigation elements for presentation mode
     */
    hideCourseNavigation() {
        const elementsToHide = [
            '.course-progress',
            '.course-navigation', 
            '.lesson-sidebar',
            '.sidebar-toggle'
        ];
        
        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
                el.setAttribute('data-presentation-hidden', 'true');
            });
        });
        
        console.log('Course navigation elements hidden');
    }

    /**
     * Show course navigation elements when exiting presentation mode
     */
    showCourseNavigation() {
        const hiddenElements = document.querySelectorAll('[data-presentation-hidden="true"]');
        hiddenElements.forEach(el => {
            el.style.display = '';
            el.removeAttribute('data-presentation-hidden');
        });
        
        console.log('Course navigation elements restored');
    }

    /**
     * Create presentation UI elements
     */
    createPresentationUI() {
        // Create main UI container
        this.presentationUI = document.createElement('div');
        this.presentationUI.className = 'presentation-ui';
        this.presentationUI.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            pointer-events: none;
        `;
        
        // Create slide counter
        if (this.config.slideCounter) {
            this.slideCounter = document.createElement('div');
            this.slideCounter.className = 'slide-counter';
            this.slideCounter.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-family: monospace;
                pointer-events: auto;
            `;
            this.presentationUI.appendChild(this.slideCounter);
        }

        // Create slide title (only shown if slide has a title)
        this.slideTitle = document.createElement('div');
        this.slideTitle.className = 'slide-title';
        this.slideTitle.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            pointer-events: none;
            max-width: 400px;
            text-align: center;
            display: none;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        this.presentationUI.appendChild(this.slideTitle);
        
        // Create exit button
        this.exitButton = document.createElement('button');
        this.exitButton.innerHTML = '×';
        this.exitButton.title = 'Exit Presentation (Esc)';
        this.exitButton.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            pointer-events: auto;
            transition: background 0.2s ease;
        `;
        this.exitButton.addEventListener('click', () => this.exitPresentation());
        this.exitButton.addEventListener('mouseenter', () => {
            this.exitButton.style.background = 'rgba(255,0,0,0.7)';
        });
        this.exitButton.addEventListener('mouseleave', () => {
            this.exitButton.style.background = 'rgba(0,0,0,0.7)';
        });
        this.presentationUI.appendChild(this.exitButton);
        
        // Create progress bar
        if (this.config.progressBar) {
            const progressContainer = document.createElement('div');
            progressContainer.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: rgba(255,255,255,0.2);
                pointer-events: auto;
            `;
            
            this.progressBar = document.createElement('div');
            this.progressBar.className = 'progress-bar';
            this.progressBar.style.cssText = `
                height: 100%;
                background: var(--accent-primary, #007acc);
                transition: width 0.3s ease;
                width: 0%;
            `;
            
            progressContainer.appendChild(this.progressBar);
            this.presentationUI.appendChild(progressContainer);
        }
        
        // Create navigation hints
        const navHints = document.createElement('div');
        navHints.innerHTML = `
            <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); 
                        color: rgba(255,255,255,0.3); font-size: 12px; text-align: center; pointer-events: none;
                        opacity: 0; transition: opacity 2s ease;" class="nav-hints">
                Use arrow keys, spacebar, or Page Up/Down to navigate<br>
                Press ESC to exit presentation
            </div>
        `;
        this.presentationUI.appendChild(navHints);
        
        // Show hints briefly
        setTimeout(() => {
            const hints = this.presentationUI.querySelector('.nav-hints');
            if (hints) hints.style.opacity = '1';
            setTimeout(() => {
                if (hints) hints.style.opacity = '0';
            }, 3000);
        }, 1000);
        
        document.body.appendChild(this.presentationUI);
    }
    
    /**
     * Show specific slide
     */
    showSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.slides.length || !this.isPresenting) return;
        
        console.log(`Showing slide ${slideIndex + 1} of ${this.slides.length}`);
        console.log('Slide element:', this.slides[slideIndex].element);
        
        // Hide all slides first
        this.slides.forEach((slide, index) => {
            slide.element.classList.remove('active-slide');
            slide.element.style.display = 'none';
        });
        
        // Show the target slide
        const targetSlide = this.slides[slideIndex];
        targetSlide.element.classList.add('active-slide');
        targetSlide.element.style.display = 'block';
        targetSlide.element.style.visibility = 'visible';

        // Apply full-screen presentation styling to active slide
        if (this.isPresenting) {
            targetSlide.element.style.position = 'fixed';
            targetSlide.element.style.top = '0';
            targetSlide.element.style.left = '0';
            targetSlide.element.style.width = '100vw';
            targetSlide.element.style.height = '100vh';
            targetSlide.element.style.zIndex = '9999';
            targetSlide.element.style.padding = '60px';
            targetSlide.element.style.overflowY = 'auto';
            targetSlide.element.style.background = 'var(--bg-secondary, #fff)';
            targetSlide.element.style.margin = '0';
            targetSlide.element.style.borderRadius = '0';
            targetSlide.element.style.border = 'none';
        }
        
        console.log('Active slide classes:', targetSlide.element.classList.toString());
        console.log('Active slide display:', targetSlide.element.style.display);
        
        this.currentSlide = slideIndex;
        
        // Update UI elements
        this.updatePresentationUI();
        
        // Update URL hash
        window.location.hash = `${this.config.urlHashPrefix}${slideIndex + 1}`;
        
        // Save position
        this.saveSlidePosition(slideIndex);
        
        // Fire event for external listeners
        window.dispatchEvent(new CustomEvent('slideChanged', {
            detail: { 
                slideIndex: slideIndex,
                slide: this.slides[slideIndex],
                totalSlides: this.slides.length
            }
        }));
    }
    
    /**
     * Update presentation UI elements
     */
    updatePresentationUI() {
        if (!this.isPresenting) return;
        
        // Update slide counter
        if (this.slideCounter) {
            this.slideCounter.textContent = `${this.currentSlide + 1} / ${this.slides.length}`;
            // Ensure the text is visible
            this.slideCounter.style.display = 'block';
            this.slideCounter.style.visibility = 'visible';
        }

        // Update slide title (show only if title exists and is not auto-generated)
        if (this.slideTitle) {
            const currentSlide = this.slides[this.currentSlide];
            const hasCustomTitle = currentSlide.title && 
                                !currentSlide.title.startsWith('Slide ') && 
                                currentSlide.title.trim() !== '';
            
            if (hasCustomTitle) {
                this.slideTitle.textContent = currentSlide.title;
                this.slideTitle.style.display = 'block';
            } else {
                this.slideTitle.style.display = 'none';
            }
        }
        
        // Update progress bar
        if (this.progressBar) {
            const progress = ((this.currentSlide + 1) / this.slides.length) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }
    
    /**
     * Navigate to next slide
     */
    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.showSlide(this.currentSlide + 1);
        }
    }
    
    /**
     * Navigate to previous slide
     */
    previousSlide() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        }
    }
    
    /**
     * Go to first slide
     */
    firstSlide() {
        this.showSlide(0);
    }
    
    /**
     * Go to last slide
     */
    lastSlide() {
        this.showSlide(this.slides.length - 1);
    }
    
    /**
     * Handle keyboard events
     */
    handleKeyboard(event) {
        if (!this.isPresenting) return;
        
        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
            case 'PageDown':
                event.preventDefault();
                this.nextSlide();
                break;
                
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                event.preventDefault();
                this.previousSlide();
                break;
                
            case 'Home':
                event.preventDefault();
                this.firstSlide();
                break;
                
            case 'End':
                event.preventDefault();
                this.lastSlide();
                break;
                
            case 'Escape':
                event.preventDefault();
                this.exitPresentation();
                break;
        }
    }
    
    /**
     * Handle hash changes for URL-based navigation
     */
    handleHashChange() {
        if (!this.isPresenting) return;
        
        const hash = window.location.hash;
        if (hash.startsWith(`#${this.config.urlHashPrefix}`)) {
            const slideNumber = parseInt(hash.replace(`#${this.config.urlHashPrefix}`, ''));
            if (!isNaN(slideNumber) && slideNumber >= 1 && slideNumber <= this.slides.length) {
                this.showSlide(slideNumber - 1);
            }
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        if (!this.isPresenting) return;
        
        // Update presentation layout if needed
        this.updatePresentationUI();
    }
    
    /**
     * Save current slide position to localStorage
     */
    saveSlidePosition(slideIndex) {
        try {
            localStorage.setItem(this.config.localStorageKey, slideIndex.toString());
        } catch (error) {
            console.warn('Failed to save slide position:', error);
        }
    }
    
    /**
     * Load last slide position from localStorage
     */
    loadLastSlidePosition() {
        try {
            const saved = localStorage.getItem(this.config.localStorageKey);
            if (saved !== null) {
                const slideIndex = parseInt(saved);
                if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < this.slides.length) {
                    return slideIndex;
                }
            }
        } catch (error) {
            console.warn('Failed to load slide position:', error);
        }
        return null;
    }
    
    /**
     * Get current presentation state
     */
    getState() {
        return {
            isPresenting: this.isPresenting,
            currentSlide: this.currentSlide,
            totalSlides: this.slides.length,
            slides: this.slides.map(slide => ({
                title: slide.title,
                index: slide.index,
                id: slide.id
            }))
        };
    }
    
    /**
     * Jump to specific slide by index
     */
    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.slides.length) {
            if (this.isPresenting) {
                this.showSlide(slideIndex);
            } else {
                this.currentSlide = slideIndex;
            }
        }
    }
    
    /**
     * Destroy the presentation engine
     */
    destroy() {
        if (this.isPresenting) {
            this.exitPresentation();
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboard);
        window.removeEventListener('hashchange', this.handleHashChange);
        window.removeEventListener('resize', this.handleResize);
        
        // Remove presentation button
        const button = document.querySelector('.presentation-mode-btn');
        if (button) {
            button.remove();
        }
        
        // Clear references
        this.slides = [];
        this.presentationUI = null;
        this.progressBar = null;
        this.slideCounter = null;
        this.exitButton = null;
    }
}

// Auto-initialize with default configuration when script loads
// Can be overridden by setting window.presentationConfig before script loads
window.addEventListener('load', () => {
    // Check if custom config was provided
    const config = window.presentationConfig || {};
    
    // Create global instance
    window.presentationEngine = new PresentationEngine(config);
    
    // Expose useful methods globally for easy access
    window.enterPresentation = (slideIndex) => window.presentationEngine.enterPresentation(slideIndex);
    window.exitPresentation = () => window.presentationEngine.exitPresentation();
    window.goToSlide = (slideIndex) => window.presentationEngine.goToSlide(slideIndex);
});

// Export for use as ES6 module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresentationEngine;
}