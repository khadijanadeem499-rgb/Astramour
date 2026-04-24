// Main JavaScript file for Space Exploration Website

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MOBILE MENU TOGGLE =====
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = menuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    });
    
    // ===== ACTIVE NAVIGATION HIGHLIGHTING =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (currentPage === linkPage) {
            link.classList.add('active');
        }
    });
    
    // ===== FORM SUBMISSION =====
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.border = '2px solid #ff4444';
                    
                    // Remove red border after 3 seconds
                    setTimeout(() => {
                        field.style.border = '';
                    }, 3000);
                } else {
                    field.style.border = '';
                }
            });
            
            // Email validation
            const emailField = form.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.style.border = '2px solid #ff4444';
                    showNotification('Please enter a valid email address', 'error');
                }
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual AJAX call)
                setTimeout(() => {
                    showNotification('Thank you for your interest! We\'ll contact you soon.', 'success');
                    form.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    });
    
    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#4CAF50' : '#ff4444'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.card, .fact-card, .stat-box, .section-title, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.closest('.stat-box').dataset.count || counter.dataset.count || '0');
                let count = 0;
                const updateCounter = setInterval(() => {
                    if (count < target) {
                        count++;
                        counter.textContent = count;
                    } else {
                        clearInterval(updateCounter);
                    }
                }, 20);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    // ===== COUNTER FOR FACTS PAGE =====
    const counterNumbers = document.querySelectorAll('.counter-number');
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseFloat(element.dataset.count || '0');
                let count = 0;
                const step = target > 100 ? 1 : 0.1;
                
                const updateCounter = setInterval(() => {
                    if (count < target) {
                        count = Math.min(count + step, target);
                        element.textContent = target > 100 ? Math.floor(count) : count.toFixed(1);
                    } else {
                        clearInterval(updateCounter);
                    }
                }, 20);
                
                numberObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    counterNumbers.forEach(counter => numberObserver.observe(counter));
    
    // ===== FACT ROTATOR =====
    const factSlides = document.querySelectorAll('.fact-slide');
    if (factSlides.length > 0) {
        let currentFact = 0;
        
        setInterval(() => {
            factSlides[currentFact].classList.remove('active');
            currentFact = (currentFact + 1) % factSlides.length;
            factSlides[currentFact].classList.add('active');
        }, 5000);
    }
    
    // ===== PLANET FILTER =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const planetCards = document.querySelectorAll('.planet-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                
                planetCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // ===== BACK TO TOP BUTTON =====
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== ADD CURRENT YEAR TO COPYRIGHT =====
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // ===== LAZY LOADING IMAGES =====
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ===== HIGHLIGHT PLANET FROM URL HASH =====
    if (window.location.hash) {
        const targetPlanet = document.querySelector(window.location.hash);
        if (targetPlanet) {
            setTimeout(() => {
                targetPlanet.scrollIntoView({ behavior: 'smooth' });
                targetPlanet.classList.add('highlight');
                setTimeout(() => {
                    targetPlanet.classList.remove('highlight');
                }, 2000);
            }, 500);
        }
    }
    
    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Press '?' to show shortcuts
        if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            showKeyboardShortcuts();
        }
        
        // Press 'm' for mobile menu
        if (e.key === 'm' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            menuBtn.click();
        }
        
        // Press 't' for back to top
        if (e.key === 't' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            backToTopBtn.click();
        }
    });
    
    function showKeyboardShortcuts() {
        const shortcuts = [
            { key: '?', description: 'Show keyboard shortcuts' },
            { key: 'm', description: 'Toggle mobile menu' },
            { key: 't', description: 'Back to top' },
            { key: 'ESC', description: 'Close menu' }
        ];
        
        let message = '📋 Keyboard Shortcuts:\n\n';
        shortcuts.forEach(shortcut => {
            message += `${shortcut.key}: ${shortcut.description}\n`;
        });
        
        alert(message);
    }
    
    // ===== PARALLAX EFFECT FOR HERO SECTION =====
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        });
    }
    
    // ===== PRELOAD ANIMATION =====
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});

// Add CSS animations to head
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .highlight {
        animation: highlight 2s ease;
    }
    
    @keyframes highlight {
        0%, 100% {
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        50% {
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
        }
    }
    
    body:not(.loaded) {
        opacity: 0;
    }
    
    body.loaded {
        opacity: 1;
        transition: opacity 0.5s ease;
    }
`;

document.head.appendChild(style);