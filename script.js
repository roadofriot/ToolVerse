// ============================================
// ToolVerse - Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll for navigation links
    initSmoothScroll();

    // Intersection Observer for scroll animations
    initScrollAnimations();

    // Mobile menu toggle
    initMobileMenu();

    // Tool item click handlers
    initToolItemHandlers();

    // Navbar scroll effect
    initNavbarScrollEffect();
});

// ============================================
// Smooth Scroll Navigation
// ============================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just '#'
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Scroll Animations with Intersection Observer
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });

    // Observe section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.classList.add('fade-in');
        observer.observe(header);
    });
}

// ============================================
// Mobile Menu Toggle
// ============================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');

            // Update toggle icon
            if (navLinks.classList.contains('active')) {
                this.textContent = '✕';
            } else {
                this.textContent = '☰';
            }
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
    }
}

// ============================================
// Tool Item Click Handlers
// ============================================
function initToolItemHandlers() {
    const toolItems = document.querySelectorAll('.tool-item');

    toolItems.forEach(item => {
        item.addEventListener('click', function () {
            const toolName = this.querySelector('.tool-name').textContent;
            const categoryCard = this.closest('.category-card');
            const categoryName = categoryCard.querySelector('.category-title').textContent;

            // Check if this is a functional tool
            if (this.classList.contains('functional')) {
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);

                // Get tool type from data attribute
                const toolType = this.dataset.tool;

                // Redirect to tools page with tool parameter
                // Now using modular app.html
                if (toolType) {
                    window.location.href = `app.html?tool=image-tools&subtool=${toolType}`;
                } else {
                    window.location.href = 'app.html?tool=image-tools';
                }
            } else if (this.classList.contains('coming-soon')) {
                // Show coming soon message
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            } else {
                // Default behavior for other tools
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);

                console.log(`Tool clicked: ${toolName} from ${categoryName}`);
            }
        });

        // Add keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');

        item.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ============================================
// Navbar Scroll Effect
// ============================================
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// Optional: Search/Filter Functionality
// ============================================
function initSearch() {
    const searchInput = document.getElementById('search-input');

    if (!searchInput) return;

    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        const categoryCards = document.querySelectorAll('.category-card');

        categoryCards.forEach(card => {
            const categoryTitle = card.querySelector('.category-title').textContent.toLowerCase();
            const toolItems = card.querySelectorAll('.tool-name');
            let hasMatch = categoryTitle.includes(searchTerm);

            // Check if any tool matches
            toolItems.forEach(tool => {
                if (tool.textContent.toLowerCase().includes(searchTerm)) {
                    hasMatch = true;
                }
            });

            // Show/hide card based on match
            if (hasMatch || searchTerm === '') {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ============================================
// Optional: Tool Modal (for future implementation)
// ============================================
function showToolModal(toolName, categoryName) {
    // This is a placeholder for future modal implementation
    // You can create a modal that shows:
    // - Tool description
    // - How to use it
    // - External links
    // - Embedded tool interface

    alert(`${toolName}\nCategory: ${categoryName}\n\nThis tool is coming soon!`);
}

// ============================================
// Optional: Add to Favorites (for future implementation)
// ============================================
function initFavorites() {
    // Future implementation for saving favorite tools
    // Could use localStorage to persist favorites
    const favorites = JSON.parse(localStorage.getItem('toolverse-favorites') || '[]');

    // Add favorite button to each tool
    const toolItems = document.querySelectorAll('.tool-item');
    toolItems.forEach((item, index) => {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = favorites.includes(index) ? '⭐' : '☆';
        favoriteBtn.setAttribute('aria-label', 'Add to favorites');

        favoriteBtn.addEventListener('click', function (e) {
            e.stopPropagation();

            const isFavorite = favorites.includes(index);
            if (isFavorite) {
                favorites.splice(favorites.indexOf(index), 1);
                this.innerHTML = '☆';
            } else {
                favorites.push(index);
                this.innerHTML = '⭐';
            }

            localStorage.setItem('toolverse-favorites', JSON.stringify(favorites));
        });

        // Uncomment to enable favorites feature
        // item.appendChild(favoriteBtn);
    });
}

// ============================================
// Analytics (Optional)
// ============================================
function trackToolClick(toolName, categoryName) {
    // Placeholder for analytics tracking
    // You can integrate with Google Analytics, Plausible, etc.
    console.log('Analytics: Tool clicked', { toolName, categoryName });
}

// ============================================
// Performance: Lazy Loading for Future Images
// ============================================
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    }
}

// ============================================
// Service Worker Registration (for PWA support)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}
