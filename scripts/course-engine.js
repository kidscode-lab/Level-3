/**
 * KidsCode Lab - Course Engine
 * Core functionality for course navigation, progress tracking, and theme management
 */

// ============== COURSE CONFIGURATION ============== 
const CourseConfig = {
    // Course structure - easily configurable
    lessons: {
        'L1': {
            title: 'Python Fundamentals',
            sections: [
                { id: '01', title: 'Introduction', file: 'L1-01-01-introduction.html' },
                { id: '02', title: 'Data Types', file: 'L1-01-02-data-types.html' },
                { id: '03', title: 'Variables', file: 'L1-01-03-variables.html' },
                { id: '04', title: 'Input/Output', file: 'L1-01-04-input-output.html' },
                { id: '05', title: 'Exercises', file: 'L1-01-05-exercises.html' }
            ]
        }
        // Add more lessons here as needed
    },
    
    // Theme configuration
    themes: {
        'dark': { name: 'Dark Theme', icon: '🌙' },
        'light': { name: 'Light Theme', icon: '☀️' },
        'high-contrast': { name: 'High Contrast', icon: '⚡' },
        'kid-friendly': { name: 'Kid-Friendly', icon: '🎨' },
        'colorful': { name: 'Colorful', icon: '🌈' },
        'print-friendly': { name: 'Print-Friendly', icon: '🖨️' }
    },
    
    themeOrder: ['dark', 'light', 'high-contrast', 'kid-friendly', 'colorful', 'print-friendly']
};

// ============== COURSE ENGINE CLASS ============== 
class CourseEngine {
    constructor() {
        this.currentTheme = 'dark';
        this.currentLesson = null;
        this.currentSection = null;
        this.progress = {};
        
        this.init();
    }
    
    init() {
        this.detectCurrentPage();
        this.initThemeSystem();
        this.initProgressTracking();
        this.initEventListeners();
        this.updateProgress();
    }
    
    // ============== PAGE DETECTION ============== 
    detectCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        // Parse filename like "L1-01-02-data-types.html"
        const match = filename.match(/L(\d+)-(\d+)-(\d+)-(.+)\.html/);
        if (match) {
            this.currentLesson = `L${match[1]}`;
            this.currentSection = match[3];
            
            console.log(`Detected: Lesson ${this.currentLesson}, Section ${this.currentSection}`);
        }
    }
    
    // ============== THEME SYSTEM ============== 
    initThemeSystem() {
        // Load saved theme
        const savedTheme = localStorage.getItem('kidsCode-theme');
        const systemPrefersDark = window.matchMedia && 
                                window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme && CourseConfig.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        } else if (systemPrefersDark) {
            this.currentTheme = 'dark';
        } else {
            this.currentTheme = 'light';
        }
        
        this.setTheme(this.currentTheme, false);
        this.updateThemeTooltip();
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('kidsCode-theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light', false);
                }
            });
        }
    }
    
    getNextTheme() {
        const currentIndex = CourseConfig.themeOrder.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % CourseConfig.themeOrder.length;
        return CourseConfig.themeOrder[nextIndex];
    }
    
    setTheme(themeName, saveToStorage = true) {
        if (!CourseConfig.themes[themeName]) return;
        
        this.currentTheme = themeName;
        document.documentElement.setAttribute('data-theme', themeName);
        
        this.updateThemeTooltip();
        
        if (saveToStorage) {
            localStorage.setItem('kidsCode-theme', themeName);
        }
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: themeName } 
        }));
        
        // Visual feedback
        this.showThemeChangeEffect();
    }
    
    cycleTheme() {
        const nextTheme = this.getNextTheme();
        this.setTheme(nextTheme);
    }
    
    updateThemeTooltip() {
        const tooltip = document.getElementById('themeTooltip');
        if (tooltip) {
            const nextTheme = this.getNextTheme();
            tooltip.textContent = `Next: ${CourseConfig.themes[nextTheme].name}`;
        }
    }
    
    showThemeChangeEffect() {
        const button = document.querySelector('.theme-cycle-button');
        if (button) {
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        }
    }
    
    // ============== PROGRESS TRACKING ============== 
    initProgressTracking() {
        // Load saved progress
        const savedProgress = localStorage.getItem('kidsCode-progress');
        if (savedProgress) {
            try {
                this.progress = JSON.parse(savedProgress);
            } catch (e) {
                console.warn('Failed to parse saved progress');
                this.progress = {};
            }
        }
    }
    
    updateProgress() {
        if (!this.currentLesson || !this.currentSection) return;
        
        // Mark current section as visited
        if (!this.progress[this.currentLesson]) {
            this.progress[this.currentLesson] = {};
        }
        this.progress[this.currentLesson][this.currentSection] = {
            visited: true,
            timestamp: Date.now()
        };
        
        // Save progress
        localStorage.setItem('kidsCode-progress', JSON.stringify(this.progress));
        
        // Update UI
        this.updateProgressBar();
        this.updateTOC();
    }
    
    updateProgressBar() {
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (!progressBar || !this.currentLesson) return;
        
        const lesson = CourseConfig.lessons[this.currentLesson];
        if (!lesson) return;
        
        const totalSections = lesson.sections.length;
        const completedSections = Object.keys(this.progress[this.currentLesson] || {}).length;
        const percentage = Math.round((completedSections / totalSections) * 100);
        
        progressBar.style.width = percentage + '%';
        
        if (progressText) {
            const currentSectionTitle = lesson.sections.find(s => s.id === this.currentSection)?.title || '';
            progressText.textContent = `Lesson ${this.currentLesson.replace('L', '')} - ${currentSectionTitle} (${percentage}% Complete)`;
        }
    }
    
    updateTOC() {
        const tocItems = document.querySelectorAll('.toc-item');
        
        tocItems.forEach(item => {
            const href = item.getAttribute('href');
            if (!href || href === '#') return;
            
            // Extract section from filename
            const match = href.match(/L(\d+)-(\d+)-(\d+)-(.+)\.html/);
            if (match) {
                const lesson = `L${match[1]}`;
                const section = match[3];
                
                if (this.progress[lesson] && this.progress[lesson][section]) {
                    item.classList.add('completed');
                }
            }
        });
    }
    
    // ============== NAVIGATION ============== 
    getCurrentSectionIndex() {
        if (!this.currentLesson || !this.currentSection) return -1;
        
        const lesson = CourseConfig.lessons[this.currentLesson];
        if (!lesson) return -1;
        
        return lesson.sections.findIndex(s => s.id === this.currentSection);
    }
    
    getNextSection() {
        const currentIndex = this.getCurrentSectionIndex();
        if (currentIndex === -1) return null;
        
        const lesson = CourseConfig.lessons[this.currentLesson];
        if (currentIndex < lesson.sections.length - 1) {
            return lesson.sections[currentIndex + 1];
        }
        
        return null;
    }
    
    getPreviousSection() {
        const currentIndex = this.getCurrentSectionIndex();
        if (currentIndex <= 0) return null;
        
        const lesson = CourseConfig.lessons[this.currentLesson];
        return lesson.sections[currentIndex - 1];
    }
    
    navigateToNext() {
        const nextSection = this.getNextSection();
        if (nextSection) {
            window.location.href = nextSection.file;
        }
    }
    
    navigateToPrevious() {
        const prevSection = this.getPreviousSection();
        if (prevSection) {
            window.location.href = prevSection.file;
        }
    }
    
    // ============== EVENT LISTENERS ============== 
    initEventListeners() {
        // Theme cycling
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-cycle-button')) {
                this.cycleTheme();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T for theme cycle
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.cycleTheme();
            }
            
            // Arrow keys for navigation (when not in input fields)
            if (!e.target.matches('input, textarea')) {
                if (e.key === 'ArrowLeft' && e.altKey) {
                    e.preventDefault();
                    this.navigateToPrevious();
                } else if (e.key === 'ArrowRight' && e.altKey) {
                    e.preventDefault();
                    this.navigateToNext();
                }
            }
        });
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }
    
    updateNavigationButtons() {
        const prevBtn = document.querySelector('.prev-btn, .nav-btn[onclick*="Prev"]');
        const nextBtn = document.querySelector('.next-btn, .nav-btn[onclick*="Next"]');
        
        if (prevBtn) {
            const hasPrev = this.getPreviousSection() !== null;
            prevBtn.disabled = !hasPrev;
            
            if (hasPrev) {
                prevBtn.onclick = () => this.navigateToPrevious();
            }
        }
        
        if (nextBtn) {
            const hasNext = this.getNextSection() !== null;
            
            if (hasNext) {
                const nextSection = this.getNextSection();
                nextBtn.textContent = `Next: ${nextSection.title} →`;
                nextBtn.onclick = () => this.navigateToNext();
            } else {
                nextBtn.textContent = 'Course Complete! 🎉';
                nextBtn.disabled = true;
            }
        }
    }
    
    // ============== UTILITY METHODS ============== 
    showNotification(message, type = 'info') {
        // Create or update notification
        let notification = document.getElementById('course-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'course-notification';
            notification.className = 'course-notification';
            document.body.appendChild(notification);
        }
        
        notification.className = `course-notification ${type}`;
        notification.textContent = message;
        notification.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
    
    // ============== PUBLIC API ============== 
    // These methods can be called from other scripts
    
    markSectionComplete(lesson, section) {
        if (!this.progress[lesson]) {
            this.progress[lesson] = {};
        }
        this.progress[lesson][section] = {
            visited: true,
            completed: true,
            timestamp: Date.now()
        };
        
        localStorage.setItem('kidsCode-progress', JSON.stringify(this.progress));
        this.updateProgressBar();
        this.updateTOC();
    }
    
    getSectionProgress(lesson, section) {
        return this.progress[lesson] && this.progress[lesson][section];
    }
    
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            this.progress = {};
            localStorage.removeItem('kidsCode-progress');
            this.updateProgressBar();
            this.updateTOC();
            this.showNotification('Progress reset successfully!', 'success');
        }
    }
    
    exportProgress() {
        const data = {
            progress: this.progress,
            theme: this.currentTheme,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kidscode-progress.json';
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Progress exported successfully!', 'success');
    }
}

// ============== GLOBAL FUNCTIONS FOR BACKWARD COMPATIBILITY ============== 

// These functions maintain compatibility with the HTML onclick handlers
function cycleTheme() {
    if (window.courseEngine) {
        window.courseEngine.cycleTheme();
    }
}

function goToNext() {
    if (window.courseEngine) {
        window.courseEngine.navigateToNext();
    }
}

function goToPrev() {
    if (window.courseEngine) {
        window.courseEngine.navigateToPrevious();
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.lesson-sidebar');
    const toggle = document.querySelector('.sidebar-toggle');
    
    if (sidebar) {
        const isActive = sidebar.classList.contains('active');
        
        if (isActive) {
            // Hide sidebar
            sidebar.classList.remove('active');
            toggle.classList.remove('hidden');
            toggle.textContent = '☰ Contents';
        } else {
            // Show sidebar
            sidebar.classList.add('active');
            toggle.classList.add('hidden');
        }
    }
}

// ============== INITIALIZATION ============== 

// Initialize course engine when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.courseEngine = new CourseEngine();
    
    // Debug helper - remove in production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.resetProgress = () => window.courseEngine.resetProgress();
        window.exportProgress = () => window.courseEngine.exportProgress();
        console.log('🐍 KidsCode Lab Course Engine loaded!');
        console.log('Debug commands: resetProgress(), exportProgress()');
    }
});

// Listen for theme changes to update any theme-dependent components
window.addEventListener('themeChanged', function(event) {
    console.log('Theme changed to:', event.detail.theme);
    
    // Add any theme-specific behaviors here
    if (event.detail.theme === 'print-friendly') {
        console.log('Print-friendly theme activated');
    }
});