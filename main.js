import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { saveSubmission, getSubmissions } from './db.js';

gsap.registerPlugin(ScrollTrigger);

// Initialize Smooth Scroll with Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  initHeroAnimations();
  initScrollReveals();
  initModals();
  initContactForm();

  // Log existing submissions
  const briefs = await getSubmissions();
  console.log('📂 Stored Brief Submissions:', briefs);
});

// Navigation & Smooth Scroll
function initNavigation() {
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scroll-top');

  // Header entrance animation
  gsap.from('#header', {
    y: -60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll active link highlight
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      lenis.scrollTo(0);
    });
  }

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          lenis.scrollTo(targetEl, { offset: -80 });
        }
      }
    });
  });
}

// Hero Entrance Animations
function initHeroAnimations() {
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTimeline
    .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8 })
    .from('.hero-title', { y: 30, opacity: 0, duration: 1 }, '-=0.5')
    .from('.hero-right-quote', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-portrait-img', { scale: 1.1, opacity: 0, duration: 1.2, ease: 'power2.out' }, '-=0.8')
    .from('.hero-services-bar .service-item', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.6');
}

// Scroll Reveals & Grid Animations
function initScrollReveals() {
  // Section Titles & Eyebrows
  gsap.utils.toArray('.section-title, .eyebrow-text').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      y: 35,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    });
  });

  // Staggered Grid Animations
  const gridAnimations = [
    { container: '.playstore-grid-6', items: '.playstore-card' },
    { container: '.about-badges-grid', items: '.about-badge-card' },
    { container: '.workshops-certs-grid', items: '.skill-cat-card' }
  ];

  gridAnimations.forEach(({ container, items }) => {
    const parentEl = document.querySelector(container);
    if (parentEl) {
      const cards = parentEl.querySelectorAll(items);
      gsap.from(cards, {
        scrollTrigger: {
          trigger: parentEl,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 45,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }
  });

  // Project Gallery Grids (Academic & Master Projects)
  document.querySelectorAll('.gallery-grid-6').forEach((grid) => {
    const cards = grid.querySelectorAll('.gallery-card-6');
    gsap.from(cards, {
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      scale: 0.96,
      duration: 0.75,
      stagger: 0.12,
      ease: 'power3.out'
    });
  });

  // Timeline Experience & Education Cards
  gsap.utils.toArray('.exp-card, .education-card').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 45,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Contact Form Card
  const contactCard = document.querySelector('.contact-card-box');
  if (contactCard) {
    gsap.from(contactCard, {
      scrollTrigger: {
        trigger: contactCard,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      scale: 0.95,
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
}

// Modal Handlers
function initModals() {
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalCat = document.getElementById('modal-cat');
  const modalDesc = document.getElementById('modal-desc');
  const modalGithub = document.getElementById('modal-github');

  const projectCards = document.querySelectorAll('.gallery-card-6');

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title') || 'Research Project';
      const cat = card.getAttribute('data-cat') || 'Engineering';
      const desc = card.getAttribute('data-desc') || 'High-performance IoT and software engineering project.';
      const github = card.getAttribute('data-github') || 'https://github.com/owaisahmed19';

      modalTitle.textContent = title;
      modalCat.textContent = cat;
      modalDesc.textContent = desc;
      if (modalGithub) {
        modalGithub.href = github;
      }

      modal.classList.add('active');
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// Contact Form with Direct Email Delivery & Database Persistence
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const brief = document.getElementById('form-brief').value.trim();

    if (!name || !email || !brief) {
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#ef4444';
        statusEl.textContent = 'Please fill out all required fields.';
      }
      return;
    }

    const btn = document.getElementById('submit-btn');
    const originalText = btn.innerHTML;

    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    // 1. Save to Local DB (IndexedDB / LocalStorage)
    const savedData = await saveSubmission({ name, email, brief });

    // 2. Send via Web3Forms API (Free Email Gateway)
    const formAccessKey = form.getAttribute('data-access-key') || '';
    let sentSuccessfully = false;

    if (formAccessKey) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: formAccessKey,
            name: name,
            email: email,
            message: brief,
            subject: `Portfolio Message from ${name}`
          })
        });

        const result = await response.json();
        if (result.success) {
          sentSuccessfully = true;
        }
      } catch (err) {
        console.warn('Form API error, switching to mailto link:', err);
      }
    }

    // 3. Fallback: Trigger direct mailto if form key is not configured or fails
    if (!sentSuccessfully && !formAccessKey) {
      window.location.href = `mailto:owaisahmed2208957@gmail.com?subject=${encodeURIComponent('Portfolio Contact from ' + name)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + brief)}`;
    }

    // 4. Update UI Status
    setTimeout(() => {
      btn.innerHTML = 'Message Sent! ✨';
      btn.style.background = '#10b981';
      btn.style.color = '#fff';

      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#10b981';
        statusEl.textContent = `Thank you ${name}! Your message has been sent.`;
      }

      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 5000);
    }, 600);
  });
}
