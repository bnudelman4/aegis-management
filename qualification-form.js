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

// Multi-step form functionality
let currentStep = 1;
const totalSteps = 5;
const formData = {};

// Show specific step
function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.funnel-question').forEach(step => step.classList.remove('active'));
    
    // Show current step
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    
    // Update progress
    updateProgress();
    
    // Update navigation buttons
    updateNavigation();
}

// Update progress bar
function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const percentage = (currentStep / totalSteps) * 100;
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Step ${currentStep} of ${totalSteps}`;
}

// Update navigation buttons
function updateNavigation() {
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    // Show/hide back button
    if (currentStep > 1) {
        backBtn.style.display = 'block';
    } else {
        backBtn.style.display = 'none';
    }
    
    // Show/hide next and submit buttons
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

// Handle next button click
document.getElementById('next-btn').addEventListener('click', () => {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }
});

// Handle back button click
document.getElementById('back-btn').addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
});

// Handle submit button click
document.getElementById('submit-btn').addEventListener('click', () => {
    if (validateCurrentStep()) {
        handleFormSubmission();
    }
});

// Validate current step
function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    console.log(`Validating step ${currentStep}, found ${requiredFields.length} required fields`);
    
    // Clear previous error states
    currentStepElement.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
    
    requiredFields.forEach(field => {
        const formGroup = field.closest('.form-group');
        console.log(`Checking field: ${field.name}, type: ${field.type}, value: "${field.value}", checked: ${field.checked}`);
        
        // Handle checkboxes differently
        if (field.type === 'checkbox') {
            if (!field.checked) {
                console.log(`Checkbox validation failed for ${field.name}`);
                showFieldError(formGroup, `This field is required`);
                field.focus();
                isValid = false;
                return;
            }
        } else if (field.type === 'radio') {
            // Handle radio buttons - check if any radio in the group is selected
            const radioGroup = currentStepElement.querySelectorAll(`input[name="${field.name}"]`);
            const isAnySelected = Array.from(radioGroup).some(radio => radio.checked);
            if (!isAnySelected) {
                console.log(`Radio validation failed for ${field.name}`);
                showFieldError(formGroup, `Please select an option`);
                field.focus();
                isValid = false;
                return;
            }
        } else if (field.tagName === 'SELECT') {
            // Handle select fields specifically
            if (!field.value || field.value === '') {
                console.log(`Select validation failed for ${field.name}: no option selected`);
                showFieldError(formGroup, `Please select an option`);
                field.focus();
                isValid = false;
                return;
            }
        } else {
            // Handle text inputs and textareas
            if (!field.value.trim() || field.value === '') {
                console.log(`Field validation failed for ${field.name}: empty value`);
                showFieldError(formGroup, `This field is required`);
                field.focus();
                isValid = false;
                return;
            }
            
            // Special validation for email
            if (field.type === 'email' && !field.value.includes('@')) {
                console.log(`Email validation failed for ${field.name}`);
                showFieldError(formGroup, `Please enter a valid email address`);
                field.focus();
                isValid = false;
                return;
            }
            
            // Special validation for phone
            if (field.type === 'tel' && field.value.trim().length < 10) {
                console.log(`Phone validation failed for ${field.name}`);
                showFieldError(formGroup, `Please enter a valid phone number`);
                field.focus();
                isValid = false;
                return;
            }
        }
    });
    
    console.log(`Step ${currentStep} validation result: ${isValid}`);
    return isValid;
}

// Show field error
function showFieldError(formGroup, message) {
    if (!formGroup) return;
    
    formGroup.classList.add('error');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and add error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    formGroup.appendChild(errorMessage);
}

// Handle form submission
function handleFormSubmission() {
    // Collect all form data
    const allFormData = new FormData();
    
    // Get all form fields
    const formFields = document.querySelectorAll('#qualification-funnel input, #qualification-funnel select, #qualification-funnel textarea');
    formFields.forEach(field => {
        if (field.type === 'file') {
            // Handle file uploads
            if (field.files.length > 0) {
                allFormData.append(field.name, field.files);
            }
        } else if (field.type === 'radio') {
            // Handle radio buttons
            if (field.checked) {
                allFormData.append(field.name, field.value);
            }
        } else if (field.type === 'checkbox') {
            // Handle checkboxes
            allFormData.append(field.name, field.checked);
        } else {
            // Handle text inputs, selects, and textareas
            allFormData.append(field.name, field.value);
        }
    });
    
    // Check consent checkbox
    const consentCheckbox = document.getElementById('consent-checkbox');
    if (!consentCheckbox.checked) {
        showNotification('Please check the consent checkbox to continue.', 'error', 'top-left');
        return;
    }
    
    // Show success message
    showNotification('Thank you for your application! We\'ll review your space and reach out with a free income projection and next steps.', 'success', 'top-left');
    
    // Store form data
    storeFormData(allFormData);
    
    // Reset form after a delay
    setTimeout(() => {
        currentStep = 1;
        showStep(1);
        updateProgress();
        updateNavigation();
        
        // Reset all form fields
        document.querySelectorAll('#qualification-funnel input, #qualification-funnel select, #qualification-funnel textarea').forEach(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                field.checked = false;
            } else if (field.type === 'file') {
                field.value = '';
            } else {
                field.value = '';
            }
        });
        
        // Hide conditional fields
        document.getElementById('furniture-description').style.display = 'none';
        document.getElementById('furnishing-offer').style.display = 'none';
    }, 3000);
}

// Store form data
function storeFormData(formData) {
    try {
        // Store in localStorage as backup
        const formDataObj = {};
        for (let [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }
        localStorage.setItem('metrohost_application', JSON.stringify(formDataObj));
        
        // Organize data for API submission
        const apiData = {
            contact: {
                name: formDataObj['full-name'] || '',
                email: formDataObj['email'] || '',
                phone: formDataObj['phone'] || '',
                preferredContact: formDataObj['preferred-contact'] || '',
                bestTime: formDataObj['best-time'] || ''
            },
            property: {
                cityZip: formDataObj['city-zip'] || '',
                spaceType: formDataObj['space-type'] || '',
                liveAtProperty: formDataObj['live-at-property'] || '',
                rentalType: formDataObj['rental-type'] || '',
                guestCapacity: formDataObj['guest-capacity'] || '',
                furnished: formDataObj['furnished'] || '',
                furnitureDetails: formDataObj['furniture-details'] || '',
                openToFurnishing: formDataObj['open-to-furnishing'] || '',
                bathroomSituation: formDataObj['bathroom-situation'] || '',
                privateEntrance: formDataObj['private-entrance'] || '',
                approximateSize: formDataObj['approximate-size'] || '',
                readyForPhotography: formDataObj['ready-for-photography'] || '',
                petsAllowed: formDataObj['pets-allowed'] || '',
                restrictions: formDataObj['restrictions'] || ''
            },
            goals: {
                hostingTimeline: formDataObj['hosting-timeline'] || '',
                priority: formDataObj['priority'] || '',
                involvementLevel: formDataObj['involvement-level'] || ''
            },
            submissionDate: new Date().toISOString(),
            source: 'MetroHost Collective Website'
        };
        
        // Submit to API
        fetch('/api/submit-application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Application submitted successfully:', data);
            if (!data.success) {
                throw new Error(data.message || 'Submission failed');
            }
        })
        .catch(error => {
            console.error('Error submitting application:', error);
            // Fallback to localStorage if API fails
            localStorage.setItem('metrohost_application', JSON.stringify(formDataObj));
            showNotification('Application saved locally. We\'ll contact you soon!', 'info', 'top-left');
        });
        
        console.log('Form data stored successfully:', formDataObj);
    } catch (error) {
        console.error('Error storing form data:', error);
    }
}

// Handle conditional field display for furniture questions
document.addEventListener('change', function(e) {
    if (e.target.name === 'furnished') {
        const furnitureDescription = document.getElementById('furniture-description');
        const furnishingOffer = document.getElementById('furnishing-offer');
        
        if (e.target.value === 'yes') {
            furnitureDescription.style.display = 'block';
            furnishingOffer.style.display = 'none';
        } else if (e.target.value === 'no') {
            furnitureDescription.style.display = 'none';
            furnishingOffer.style.display = 'block';
        }
    }
});

// Form field focus effects and validation
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    field.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
        // Clear error state when user starts typing
        if (this.parentElement.classList.contains('error')) {
            this.parentElement.classList.remove('error');
            const errorMessage = this.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    });
    
    field.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
    
    // Clear error on input
    field.addEventListener('input', function() {
        if (this.parentElement.classList.contains('error')) {
            this.parentElement.classList.remove('error');
            const errorMessage = this.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    });
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

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation state
    updateNavigation();
    
    // Initialize progress
    updateProgress();
});

