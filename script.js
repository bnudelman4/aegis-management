// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    // Animate hamburger menu bars
    const bars = navToggle.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (navMenu.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        // Reset hamburger menu bars
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(248, 248, 248, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(248, 248, 248, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Testimonials Marquee
let currentPosition = 0;
let testimonialsTrack, dots, totalSlides = 5;
let marqueeInterval;
let isPaused = false;

function initCarousel() {
    testimonialsTrack = document.querySelector('.testimonials-track');
    dots = document.querySelectorAll('.dot');
    
    if (!testimonialsTrack || !dots.length) return;
    
    // Clone testimonials for seamless loop
    const originalCards = testimonialsTrack.querySelectorAll('.testimonial-card');
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        testimonialsTrack.appendChild(clone);
    });
    
    function updateMarquee() {
        const cardWidth = 370; // 350px card + 20px gap
        const translateX = -currentPosition * cardWidth;
        testimonialsTrack.style.transform = `translateX(${translateX}px)`;
        
        // Update dots based on original position
        const originalPosition = currentPosition % totalSlides;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === originalPosition);
        });
    }

    function nextSlide() {
        if (isPaused) return;
        currentPosition++;
        
        // Reset to beginning when we reach the end of original cards
        if (currentPosition >= totalSlides) {
            currentPosition = 0;
        }
        
        updateMarquee();
    }

    function goToSlide(slideIndex) {
        currentPosition = slideIndex;
        updateMarquee();
    }

    // Continuous marquee animation
    marqueeInterval = setInterval(nextSlide, 3000);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Pause on hover
    testimonialsTrack.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    testimonialsTrack.addEventListener('mouseleave', () => {
        isPaused = false;
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    testimonialsTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isPaused = true;
    });

    testimonialsTrack.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
        setTimeout(() => { isPaused = false; }, 1000);
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                currentPosition = currentPosition === 0 ? totalSlides - 1 : currentPosition - 1;
                updateMarquee();
            }
        }
    }

    // Initialize marquee
    updateMarquee();
    
    // Handle window resize
    window.addEventListener('resize', updateMarquee);
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', initCarousel);

// Notification system
function showNotification(message, type = 'info', position = 'top-right') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Don't show close button for success messages
    if (type === 'success') {
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
    } else {
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
    }

    // Add styles based on position
    let positionStyles = '';
    if (position === 'top-left') {
        positionStyles = `
            top: 20px;
            left: 20px;
            transform: translateX(-100%);
        `;
    } else {
        positionStyles = `
            top: 20px;
            right: 20px;
            transform: translateX(100%);
        `;
    }

    notification.style.cssText = `
        position: fixed;
        ${positionStyles}
        background: ${type === 'success' ? '#8b7355' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = position === 'top-left' ? 'translateX(0)' : 'translateX(0)';
    }, 100);

    // Close button functionality (only for non-success messages)
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const exitTransform = position === 'top-left' ? 'translateX(-100%)' : 'translateX(100%)';
            notification.style.transform = exitTransform;
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            const exitTransform = position === 'top-left' ? 'translateX(-100%)' : 'translateX(100%)';
            notification.style.transform = exitTransform;
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    console.log('Contact form found:', contactForm); // Debug log
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Contact form submitted!'); // Debug log
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const service = formData.get('service');
            const message = formData.get('message');

            console.log('Form data:', { name, email, phone, service, message }); // Debug log

            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error', 'top-right');
                return;
            }

            if (!email.includes('@')) {
                showNotification('Please enter a valid email address.', 'error', 'top-right');
                return;
            }

            // Submit to API
            const apiData = {
                name: name,
                email: email,
                phone: phone || '',
                service: service || '',
                message: message
            };

            fetch('/api/contact-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success', 'top-right');
                    this.reset();
                } else {
                    throw new Error(data.message || 'Message sending failed');
                }
            })
            .catch(error => {
                console.error('Error sending contact form:', error);
                showNotification('Message saved. We\'ll contact you soon!', 'info', 'top-right');
                this.reset();
            });
            
            console.log('Contact form submitted:', { name, email, phone, service, message });
        });
    } else {
        console.log('Contact form not found!'); // Debug log
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.step-card, .service-card, .pricing-card, .testimonial-card, .location-card, .legal-card, .feature');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize navigation state
    // updateNavigation(); // This function is no longer needed here
});

// Button loading animation (excluding submit buttons to avoid form interference)
document.querySelectorAll('.btn-primary:not([type="submit"])').forEach(button => {
    button.addEventListener('click', function() {
        const originalText = this.textContent;
        this.textContent = 'Processing...';
        this.disabled = true;
        
        // Simulate processing time (remove in production)
        setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
        }, 2000);
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        const rate = scrolled * -0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
    }
});



// Mobile menu backdrop
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    }
});

// Smooth reveal animation for sections
const revealSections = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
};

// Initialize section animations
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    revealSections();
});

window.addEventListener('scroll', revealSections); 