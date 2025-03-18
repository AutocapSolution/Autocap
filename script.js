// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Sticky Header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Active Navigation Link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('nav ul');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.checked = false;
        });
    });

    // Loan Calculator
    const loanAmountInput = document.getElementById('loan-amount');
    const loanAmountSlider = document.getElementById('loan-amount-slider');
    const interestRateInput = document.getElementById('interest-rate');
    const interestRateSlider = document.getElementById('interest-rate-slider');
    const loanTenureInput = document.getElementById('loan-tenure');
    const loanTenureSlider = document.getElementById('loan-tenure-slider');
    const calculateBtn = document.getElementById('calculate-btn');
    const monthlyEMI = document.getElementById('monthly-emi');
    const totalInterest = document.getElementById('total-interest');
    const totalAmount = document.getElementById('total-amount');
    const emiChart = document.getElementById('emi-chart');
    const rateOptions = document.querySelectorAll('.rate-option');
    
    let currentRateType = 'reducing'; // Default rate type

    // Rate type selector
    rateOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            rateOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update current rate type
            currentRateType = this.getAttribute('data-rate-type');
            
            // Recalculate EMI with new rate type
            calculateEMI();
        });
    });

    // Initialize Chart
    let myChart;
    function initChart(principal, interest) {
        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(emiChart, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [principal, interest],
                    backgroundColor: ['#0056b3', '#ff6b00'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#fff',
                            font: {
                                family: 'Poppins',
                                size: 12
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                return `₹ ${value.toLocaleString('en-IN')}`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // Sync input and slider values
    loanAmountInput.addEventListener('input', function() {
        loanAmountSlider.value = this.value;
    });

    loanAmountSlider.addEventListener('input', function() {
        loanAmountInput.value = this.value;
    });

    interestRateInput.addEventListener('input', function() {
        interestRateSlider.value = this.value;
    });

    interestRateSlider.addEventListener('input', function() {
        interestRateInput.value = this.value;
    });

    loanTenureInput.addEventListener('input', function() {
        loanTenureSlider.value = this.value;
    });

    loanTenureSlider.addEventListener('input', function() {
        loanTenureInput.value = this.value;
    });

    // Calculate EMI
    function calculateEMI() {
        const principal = parseFloat(loanAmountInput.value);
        const ratePercent = parseFloat(interestRateInput.value);
        const years = parseFloat(loanTenureInput.value);
        const months = years * 12; // Total months
        
        let emi, totalPayment, interestPayment;
        
        if (currentRateType === 'reducing') {
            // Reducing balance method (compound interest)
            const monthlyRate = ratePercent / 100 / 12; // Monthly interest rate
            
            // EMI calculation formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
            emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
            totalPayment = emi * months;
            interestPayment = totalPayment - principal;
        } else {
            // Flat rate method (simple interest)
            const totalInterestAmount = principal * (ratePercent / 100) * years;
            totalPayment = principal + totalInterestAmount;
            emi = totalPayment / months;
            interestPayment = totalInterestAmount;
        }

        // Update results
        monthlyEMI.textContent = `₹ ${emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
        totalInterest.textContent = `₹ ${interestPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
        totalAmount.textContent = `₹ ${totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

        // Update chart
        initChart(principal, interestPayment);
    }

    // Calculate EMI on button click
    calculateBtn.addEventListener('click', calculateEMI);

    // Initialize calculator with default values
    calculateEMI();

    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    let currentIndex = 0;

    function showTestimonial(index) {
        if (index < 0) {
            currentIndex = testimonialCards.length - 1;
        } else if (index >= testimonialCards.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        const translateValue = -currentIndex * 100 + '%';
        testimonialSlider.style.transform = `translateX(${translateValue})`;
    }

    prevBtn.addEventListener('click', () => {
        showTestimonial(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        showTestimonial(currentIndex + 1);
    });

    // Auto slide testimonials
    let testimonialInterval = setInterval(() => {
        showTestimonial(currentIndex + 1);
    }, 5000);

    // Pause auto slide on hover
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });

    testimonialSlider.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
            showTestimonial(currentIndex + 1);
        }, 5000);
    });

    // Newsletter Subscription
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email
            const email = this.querySelector('input[type="email"]').value;
            
            // Here you would typically send the email to a server
            // For demo purposes, we'll just show an alert
            alert(`Thank you for subscribing to our newsletter with email: ${email}`);
            
            // Clear the form
            this.reset();
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .about-content, .calculator-container, .testimonial-card, .contact-container');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Set initial styles for animation
    document.querySelectorAll('.service-card, .about-content, .calculator-container, .testimonial-card, .contact-container').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run animation on initial load
    animateOnScroll();
    
    // Bank Partners Animation
    const partnerLogos = document.querySelectorAll('.partner-logo');
    
    // Add individual hover effect to partner logos
    partnerLogos.forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            this.querySelector('img').style.filter = 'grayscale(0%)';
            this.querySelector('img').style.opacity = '1';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.querySelector('img').style.filter = 'grayscale(100%)';
            this.querySelector('img').style.opacity = '0.7';
        });
    });
    
    // Adjust animation speed based on screen width
    function updateSliderSpeed() {
        const partnersSlider = document.querySelector('.partners-slider');
        if (partnersSlider) {
            const speed = window.innerWidth < 768 ? '20s' : '30s';
            partnersSlider.style.animationDuration = speed;
        }
    }
    
    // Call initially and on window resize
    updateSliderSpeed();
    window.addEventListener('resize', updateSliderSpeed);
}); 