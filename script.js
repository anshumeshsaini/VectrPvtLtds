/* script.js - Core Interactive Logic for Vector Pvt. Ltd. */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initCarousel();
  initCalculator();
  initFAQAccordion();
  initScrollReveal();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL EFFECTS
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger once on load to maintain state on page refresh
}

/* ==========================================================================
   2. ACCESSIBLE MOBILE DRAWER NAV
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (!hamburger || !mobileNav) return;

  const toggleMenu = () => {
    const isOpen = mobileNav.classList.contains('open');
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    
    // Set accessibility states
    hamburger.setAttribute('aria-expanded', !isOpen);
    
    if (!isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      // Trap focus or focus on first link
      const firstLink = mobileNav.querySelector('a');
      if (firstLink) setTimeout(() => firstLink.focus(), 100);
    } else {
      document.body.style.overflow = ''; // Restore background scrolling
    }
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when links are clicked
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Handle escape key to close menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMenu();
      hamburger.focus();
    }
  });
}

/* ==========================================================================
   3. HERO CAROUSEL / SLIDER LOGIC
   ========================================================================== */
function initCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.carousel-slide');
  const prevBtn = carousel.querySelector('.carousel-btn-prev');
  const nextBtn = carousel.querySelector('.carousel-btn-next');
  const indicatorsContainer = carousel.querySelector('.carousel-indicators');
  const playToggle = carousel.querySelector('.carousel-play-toggle');

  if (slides.length === 0) return;

  let currentIdx = 0;
  let autoplayInterval = null;
  let isPlaying = true;
  const slideDuration = 6000; // 6 seconds per slide

  // Create dot indicators dynamically
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.classList.add('indicator-dot');
    if (idx === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoplay();
    });
    indicatorsContainer.appendChild(dot);
  });

  const dots = indicatorsContainer.querySelectorAll('.indicator-dot');

  function updateCarousel() {
    slides.forEach((slide, idx) => {
      if (idx === currentIdx) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentIdx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToSlide(idx) {
    currentIdx = (idx + slides.length) % slides.length;
    updateCarousel();
  }

  function nextSlide() {
    goToSlide(currentIdx + 1);
  }

  function prevSlide() {
    goToSlide(currentIdx - 1);
  }

  // Bind controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
  }

  // Keyboard navigation
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoplay();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoplay();
    }
  });

  // Autoplay functionality
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, slideDuration);
    isPlaying = true;
    if (playToggle) {
      playToggle.innerHTML = '<span class="icon-pause">II</span>';
      playToggle.setAttribute('aria-label', 'Pause slider autoplay');
    }
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
    isPlaying = false;
    if (playToggle) {
      playToggle.innerHTML = '<span class="icon-play">▶</span>';
      playToggle.setAttribute('aria-label', 'Play slider autoplay');
    }
  }

  function resetAutoplay() {
    if (isPlaying) {
      stopAutoplay();
      startAutoplay();
    }
  }

  if (playToggle) {
    playToggle.addEventListener('click', () => {
      if (isPlaying) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  // Initialize
  updateCarousel();
  startAutoplay();
}

/* ==========================================================================
   4. SHIPPING COST CALCULATOR LOGIC
   ========================================================================== */
function initCalculator() {
  const calcForm = document.getElementById('freight-calc-form');
  const weightInput = document.getElementById('calc-weight');
  const weightVal = document.getElementById('weight-val');
  const resultsPanel = document.getElementById('calc-results');

  if (!calcForm || !weightInput) return;

  // Realtime weight slider visual feedback
  weightInput.addEventListener('input', (e) => {
    weightVal.textContent = `${e.target.value} kg`;
  });

  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Fetch inputs
    const serviceType = document.getElementById('calc-service').value;
    const origin = document.getElementById('calc-origin').value;
    const destination = document.getElementById('calc-destination').value;
    const weight = parseFloat(weightInput.value);
    const speed = document.getElementById('calc-speed').value;

    // Estimate formulas (High fidelity simulation)
    let baseRate = 0;
    let factorOrigin = 1.0;
    let factorDest = 1.0;
    let serviceLabel = '';

    // Service base factors
    switch (serviceType) {
      case 'express':
        baseRate = 150.00;
        serviceLabel = 'VECTR Express';
        break;
      case 'forwarding':
        baseRate = 80.00;
        serviceLabel = 'Pan India Standard';
        break;
      case 'ecommerce':
        baseRate = 60.00;
        serviceLabel = 'eCommerce Shipping';
        break;
      case 'supplychain':
        baseRate = 120.00;
        serviceLabel = 'Bulk Business';
        break;
      default:
        baseRate = 70.00;
        serviceLabel = 'Standard Delivery';
    }

    // Distance multiplier lookup
    const distanceMultipliers = {
      'northindia': 1.0,
      'southindia': 1.4,
      'eastindia': 1.2,
      'westindia': 1.3,
      'centralindia': 0.8,
      'northeast': 1.6
    };

    factorOrigin = distanceMultipliers[origin] || 1.0;
    factorDest = distanceMultipliers[destination] || 1.0;

    // Speed factors
    let speedFactor = 1.0;
    let transitTime = '3-5 Days';
    if (speed === 'express') {
      speedFactor = 1.8;
      transitTime = '1-2 Days';
    } else if (speed === 'economy') {
      speedFactor = 0.7;
      transitTime = '5-8 Days';
    }

    // Dynamic weight factor (Logarithmic scaling to mimic volume discounts)
    // Formula: Base Rate * WeightFactor * Regional Distance * SpeedFactor
    const weightFactor = 1.0 + Math.log2(weight + 1) * 0.8;
    const totalEstimate = baseRate * weightFactor * Math.max(factorOrigin, factorDest) * speedFactor;

    // Display formatted results
    document.getElementById('res-cost').textContent = `₹${totalEstimate.toFixed(2)}`;
    document.getElementById('res-service').textContent = serviceLabel;
    document.getElementById('res-transit').textContent = transitTime;
    document.getElementById('res-route').textContent = `${formatString(origin)} ➔ ${formatString(destination)}`;

    // Animate display container
    resultsPanel.style.display = 'block';
    resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Helper string formatter
  function formatString(str) {
    if (str === 'northindia') return 'North India';
    if (str === 'southindia') return 'South India';
    if (str === 'eastindia') return 'East India';
    if (str === 'westindia') return 'West India';
    if (str === 'centralindia') return 'Central India';
    if (str === 'northeast') return 'Northeast India';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

/* ==========================================================================
   5. INTERACTIVE ACCORDION FAQS
   ========================================================================== */
function initFAQAccordion() {
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const panel = item.querySelector('.faq-panel');
      const isActive = item.classList.contains('active');

      // Close all other accordions (strictly maintain clean user focus)
      const openItems = document.querySelectorAll('.faq-item.active');
      openItems.forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('active');
          openItem.querySelector('.faq-panel').style.maxHeight = null;
        }
      });

      // Toggle active item
      item.classList.toggle('active');
      if (!isActive) {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      } else {
        panel.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================================================
   6. DYNAMIC SCROLL REVEAL EFFECTS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  // Select all nodes designated for animated entry
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null, // screen viewport
    threshold: 0.1, // trigger when 10% is visible
    rootMargin: '0px 0px -50px 0px' // slightly trigger before scrolling completely past
  };

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop tracking once animated
      }
    });
  };

  const observer = new IntersectionObserver(revealCallback, observerOptions);
  
  revealElements.forEach(element => {
    observer.observe(element);
  });
}
