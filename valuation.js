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

    // Populate year dropdown
    const yearSelect = document.getElementById('year');
    if (yearSelect) {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= currentYear - 20; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }

    // Handle valuation form submission
    const valuationForm = document.getElementById('valuation-form');
    if (valuationForm) {
        valuationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const carMake = document.getElementById('car-make').value;
            const carModel = document.getElementById('car-model').value;
            const year = document.getElementById('year').value;
            const fuelType = document.getElementById('fuel-type').value;
            const variant = document.getElementById('variant').value;
            const kilometers = document.getElementById('kilometers').value;
            const owners = document.getElementById('owners').value;
            const condition = document.getElementById('condition').value;
            
            // Get selected features
            const features = [];
            document.querySelectorAll('input[name="features"]:checked').forEach(checkbox => {
                features.push(checkbox.value);
            });
            
            // Calculate valuation (simplified for demo)
            calculateValuation(carMake, carModel, year, fuelType, variant, kilometers, owners, condition, features);
        });
    }

    // Calculate car valuation
    function calculateValuation(make, model, year, fuelType, variant, kilometers, owners, condition, features) {
        // This is a simplified valuation algorithm for demonstration purposes
        // In a real application, this would be more complex and likely use backend data
        
        // Base values for different makes (simplified)
        const baseValues = {
            'maruti': 400000,
            'hyundai': 450000,
            'tata': 420000,
            'mahindra': 500000,
            'honda': 480000,
            'toyota': 550000,
            'kia': 600000,
            'mg': 580000,
            'ford': 450000,
            'volkswagen': 480000,
            'renault': 400000,
            'skoda': 470000,
            'nissan': 430000,
            'other': 400000
        };
        
        // Get base value for the make
        let baseValue = baseValues[make] || 400000;
        
        // Adjust for year (depreciation)
        const currentYear = new Date().getFullYear();
        const age = currentYear - parseInt(year);
        const yearFactor = Math.pow(0.9, age); // 10% depreciation per year
        
        // Adjust for kilometers
        const kmFactor = 1 - (parseInt(kilometers) / 200000); // Simplified depreciation based on kilometers
        
        // Adjust for owners
        const ownersFactor = owners === '1' ? 1 : 
                            owners === '2' ? 0.9 : 
                            owners === '3' ? 0.8 : 0.7;
        
        // Adjust for condition
        const conditionFactor = condition === 'excellent' ? 1.1 : 
                               condition === 'good' ? 1 : 
                               condition === 'fair' ? 0.9 : 0.8;
        
        // Adjust for features (each feature adds a small percentage)
        const featuresFactor = 1 + (features.length * 0.02); // Each feature adds 2%
        
        // Calculate estimated value
        let estimatedValue = baseValue * yearFactor * kmFactor * ownersFactor * conditionFactor * featuresFactor;
        
        // Add some randomness for min and max values
        const minValue = Math.round(estimatedValue * 0.9 / 1000) * 1000; // Round to nearest thousand
        const maxValue = Math.round(estimatedValue * 1.1 / 1000) * 1000; // Round to nearest thousand
        
        // Display the result
        displayValuationResult(make, model, year, variant, fuelType, kilometers, owners, minValue, maxValue);
    }

    // Display valuation result
    function displayValuationResult(make, model, year, variant, fuelType, kilometers, owners, minValue, maxValue) {
        // Format the car name
        const carName = `${year} ${capitalizeFirstLetter(make)} ${model} ${variant.toUpperCase()}`;
        
        // Update result elements
        document.getElementById('result-car-name').textContent = carName;
        document.getElementById('result-fuel-type').innerHTML = `<i class="fas fa-gas-pump"></i> ${capitalizeFirstLetter(fuelType)}`;
        document.getElementById('result-kilometers').innerHTML = `<i class="fas fa-road"></i> ${formatNumber(kilometers)} km`;
        document.getElementById('result-owners').innerHTML = `<i class="fas fa-user"></i> ${formatOwners(owners)}`;
        
        // Format and display price range
        document.getElementById('price-min').textContent = formatCurrency(minValue);
        document.getElementById('price-max').textContent = formatCurrency(maxValue);
        
        // Set price slider bar width based on the range
        const range = maxValue - minValue;
        const midPoint = minValue + (range / 2);
        const percentage = ((midPoint - minValue) / range) * 100;
        document.querySelector('.price-slider-bar').style.width = `${percentage}%`;
        
        // Show the result section
        document.getElementById('valuation-result').style.display = 'block';
        
        // Scroll to result section
        document.getElementById('valuation-result').scrollIntoView({ behavior: 'smooth' });
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Helper function to format numbers with commas
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Helper function to format currency
    function formatCurrency(number) {
        return formatNumber(number);
    }

    // Helper function to format owners text
    function formatOwners(owners) {
        if (owners === '1') return '1st Owner';
        if (owners === '2') return '2nd Owner';
        if (owners === '3') return '3rd Owner';
        return '4+ Owners';
    }

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
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
            this.reset();
        });
    }
}); 