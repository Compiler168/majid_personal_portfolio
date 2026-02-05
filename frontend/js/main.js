// API Configuration
// Use production URL for deployed version, localhost for development
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://majid-personal-portfolio.vercel.app/api';

// Utility Functions
const showMessage = (elementId, message, type) => {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = type;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
};

const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return null;
    }
};

const postData = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Always try to parse JSON
        return await response.json();
    } catch (error) {
        console.error(`Error posting to ${endpoint}:`, error);
        return { success: false, message: 'Could not connect to server. Please try again later.' };
    }
};

// Navigation Hamburger Menu & Active State
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    // Sticky Navbar shadow
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Hire Me Scroll Logic
    const hireButtons = document.querySelectorAll('#hireBtn, #hireMeHero');
    hireButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Close menu when link is clicked
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Active Link on Scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Scroll Reveal Animation (Professional v2.1)
    const reveal = () => {
        const reveals = document.querySelectorAll('section, .skill-card, .service-card, .portfolio-card, .testimonial-card, .value-card, .stat-item, .freelance-card');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const revealTop = el.getBoundingClientRect().top;
            const revealPoint = 80; // Slightly more sensitive
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', reveal);
    reveal(); // Initial check
});

// Load Skills
// Load Skills
function loadSkills() {
    const skills = portfolioData.skills;
    const skillsGrid = document.getElementById('skillsGrid');

    if (!skills || skills.length === 0) {
        skillsGrid.innerHTML = '<p>No skills found.</p>';
        return;
    }

    skillsGrid.innerHTML = skills.map(skill => `
        <div class="skill-card reveal">
            <div class="skill-icon"><i class="${skill.icon}"></i></div>
            <h3>${skill.name}</h3>
        </div>
    `).join('');
}

// Load Services
function loadServices() {
    const services = portfolioData.services;
    const servicesGrid = document.getElementById('servicesGrid');

    if (!services || services.length === 0) {
        servicesGrid.innerHTML = '<p>No services found.</p>';
        return;
    }

    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card reveal">
            <div class="service-icon"><i class="${service.icon}"></i></div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        </div>
    `).join('');
}

// Load Portfolio Projects
function loadPortfolio() {
    const projects = portfolioData.projects;
    const portfolioGrid = document.getElementById('portfolioGrid');

    if (!projects || projects.length === 0) {
        portfolioGrid.innerHTML = '<p>No projects found.</p>';
        return;
    }

    window.allProjects = projects;

    portfolioGrid.innerHTML = '';

    projects.forEach(project => {
        const isIcon = !project.image.includes('/');
        const card = document.createElement('a');
        card.href = project.link || '#';
        card.target = "_blank";
        card.className = 'portfolio-card reveal';
        card.innerHTML = `
            <div class="portfolio-image">
                ${isIcon ? `<span>${project.image}</span>` : `<img src="${project.image}" alt="${project.title}">`}
            </div>
            <div class="portfolio-info">
                <p class="portfolio-category">${project.category}</p>
                <h3>${project.title}</h3>
                <p class="portfolio-description">${project.description}</p>
                <div class="portfolio-link">
                    <span>View Project <i class="fas fa-arrow-right"></i></span>
                </div>
            </div>
        `;

        portfolioGrid.appendChild(card);
    });
}

// Load Testimonials
function loadTestimonials() {
    const testimonials = portfolioData.testimonials;
    const testimonialsGrid = document.getElementById('testimonialsGrid');

    if (!testimonials || testimonials.length === 0) {
        testimonialsGrid.innerHTML = '<p>No testimonials found.</p>';
        return;
    }

    testimonialsGrid.innerHTML = testimonials.map(testimonial => {
        // Fallback for image if it doesn't exist
        const imageHtml = testimonial.image ?
            `<img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : '';

        const initials = testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase();

        return `
        <div class="testimonial-card reveal">
            <div class="testimonial-quote"><i class="fas fa-quote-left"></i></div>
            <p class="testimonial-text">"${testimonial.text}"</p>
            <div class="testimonial-user">
                <div class="testimonial-avatar">
                    ${imageHtml}
                    <div class="avatar-placeholder" style="${testimonial.image ? 'display:none' : 'display:flex'}">${initials}</div>
                </div>
                <div class="testimonial-info">
                    <h4>${testimonial.name}</h4>
                    <p class="testimonial-location"><i class="fas fa-map-marker-alt"></i> ${testimonial.location}</p>
                    <div class="rating">${'★'.repeat(testimonial.rating)}</div>
                </div>
            </div>
        </div>
    `}).join('');
}

// Show Project Modal
function showProjectModal(projectId) {
    const project = window.allProjects.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('projectModal');

    const features = project.features;
    const techStack = project.technologies;

    const projectDetailsHTML = `
        <div class="project-detail">
            <h2>${project.title}</h2>
            
            <h3>Overview</h3>
            <p>${project.overview}</p>
            
            <h3>Problem & Solution</h3>
            <p><strong>Problem:</strong> ${project.problem}</p>
            <p><strong>Solution:</strong> ${project.solution}</p>
            
            <h3>Key Features</h3>
            <ul>
                ${Array.isArray(features) ? features.map(feature => `<li>${feature}</li>`).join('') : ''}
            </ul>
            
            <h3>Tech Stack</h3>
            <div class="project-tech-stack">
                ${Array.isArray(techStack) ? techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('') : ''}
            </div>
            
            <div class="project-btn-group">
                ${project.link ? `<a href="${project.link}" target="_blank" class="btn btn-primary">View on Behance</a>` : ''}
                <a href="#contact" class="btn btn-secondary" onclick="document.getElementById('projectModal').style.display='none'">Inquire Now</a>
            </div>
        </div>
    `;

    document.getElementById('projectDetails').innerHTML = projectDetailsHTML;
    modal.style.display = 'block';
}

// Close Modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Helper function to show field errors
        const showFieldError = (fieldId, message) => {
            const field = document.getElementById(fieldId);
            const formGroup = field.parentElement;
            field.classList.add('error');

            // Remove existing error message if any
            const existingError = formGroup.querySelector('.error-text');
            if (existingError) existingError.remove();

            // Add new error message
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-text';
            errorSpan.textContent = message;
            formGroup.appendChild(errorSpan);
        };

        // Clear all field errors
        const clearFieldErrors = () => {
            contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            contactForm.querySelectorAll('.error-text').forEach(el => el.remove());
        };

        // Validate form fields
        const validateForm = (formData) => {
            const errors = [];

            if (!formData.name || formData.name.length < 2) {
                errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email || !emailRegex.test(formData.email)) {
                errors.push({ field: 'email', message: 'Please enter a valid email address' });
            }

            if (!formData.subject || formData.subject.length < 3) {
                errors.push({ field: 'subject', message: 'Subject must be at least 3 characters' });
            }

            if (!formData.message || formData.message.length < 10) {
                errors.push({ field: 'message', message: 'Message must be at least 10 characters' });
            }

            return errors;
        };

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous errors
            clearFieldErrors();

            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            // Client-side validation
            const validationErrors = validateForm(formData);
            if (validationErrors.length > 0) {
                validationErrors.forEach(err => showFieldError(err.field, err.message));
                showMessage('formMessage', validationErrors[0].message, 'error');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            const originalText = submitBtn.textContent;

            try {
                const result = await postData('/contact', formData);

                if (result && result.success) {
                    showMessage('formMessage', result.message || 'Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    // Handle validation errors from server
                    if (result && result.errors && Array.isArray(result.errors)) {
                        result.errors.forEach(err => {
                            if (err.field) showFieldError(err.field, err.message);
                        });
                    }
                    showMessage('formMessage', result?.message || 'Failed to send message. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                showMessage('formMessage', 'Unable to connect to server. Please try again later.', 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.textContent = originalText;
            }
        });
    }
});

// Load Social Links
function loadSocialLinks() {
    const heroSocial = document.getElementById('heroSocialLinks');
    const contactSocial = document.getElementById('contactSocialLinks');

    const socialHTML = portfolioData.socialLinks.map(link => `
        <a href="${link.url}" title="${link.name}" target="_blank"><i class="${link.icon}"></i></a>
    `).join('');

    if (heroSocial) heroSocial.innerHTML = socialHTML;
    if (contactSocial) contactSocial.innerHTML = socialHTML;
}

// Load all data on page load
window.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    loadServices();
    loadPortfolio();
    loadTestimonials();
    loadSocialLinks();

    // Hire Me Buttons
    const hireMeBtns = ['hireBtn', 'hireMeHero'];
    hireMeBtns.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            });
        }
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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
