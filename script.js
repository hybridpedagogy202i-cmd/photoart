/**
 * AWWWARDS Grade Portfolio - Interactive JavaScript
 * Features: Custom cursor, smooth scroll, parallax, reveal animations, loader
 */

// ========================================
// DOM Elements
// ========================================
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');
const loader = document.querySelector('.loader');
const navLinks = document.querySelectorAll('.nav-link');
const projectCards = document.querySelectorAll('.project-card');
const skillTags = document.querySelectorAll('.skill-tag');
const socialLinks = document.querySelectorAll('.social-link');
const revealElements = document.querySelectorAll('.reveal');
const parallaxElements = document.querySelectorAll('.parallax');

// ========================================
// Loader
// ========================================
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1500);
});

// ========================================
// Custom Cursor
// ========================================
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let cursorDotX = 0;
let cursorDotY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Immediate cursor dot movement
  cursorDotX = mouseX;
  cursorDotY = mouseY;
  cursorDot.style.left = cursorDotX + 'px';
  cursorDot.style.top = cursorDotY + 'px';
});

// Smooth cursor follow
function animateCursor() {
  const dx = mouseX - cursorX;
  const dy = mouseY - cursorY;
  
  cursorX += dx * 0.15;
  cursorY += dy * 0.15;
  
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  
  requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor hover effects
const interactiveElements = [
  ...navLinks,
  ...projectCards,
  ...skillTags,
  ...socialLinks,
  document.querySelector('.contact-btn'),
  ...document.querySelectorAll('a')
];

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
  });
  
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
  });
});

// Hide cursor on leave
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorDot.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorDot.style.opacity = '1';
});

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// Reveal on Scroll Animation
// ========================================
const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;
  
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    
    if (elementTop < triggerBottom) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// ========================================
// Parallax Effect
// ========================================
const parallaxScroll = () => {
  const scrolled = window.pageYOffset;
  
  parallaxElements.forEach(element => {
    const speed = element.getAttribute('data-speed') || 0.5;
    const yPos = -(scrolled * speed);
    element.style.transform = `translateY(${yPos}px)`;
  });
};

window.addEventListener('scroll', parallaxScroll);

// ========================================
// Magnetic Button Effect
// ========================================
const magneticButtons = document.querySelectorAll('.contact-btn, .project-view-btn');

magneticButtons.forEach(button => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0, 0)';
  });
});

// ========================================
// Text Scramble Effect on Hover
// ========================================
class TextScramble {
  constructor(element) {
    this.element = element;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.element.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.element.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Apply scramble effect to hero title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const scrambler = new TextScramble(heroTitle);
  const originalText = heroTitle.innerText;
  
  heroTitle.addEventListener('mouseenter', () => {
    scrambler.setText(originalText);
  });
}

// ========================================
// Intersection Observer for Performance
// ========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

revealElements.forEach(el => observer.observe(el));

// ========================================
// Project Cards Stagger Animation
// ========================================
const projectGrid = document.querySelector('.projects-grid');

if (projectGrid) {
  const cards = projectGrid.querySelectorAll('.project-card');
  
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    projectObserver.observe(card);
  });
}

// ========================================
// Skill Tags Float Animation
// ========================================
skillTags.forEach((tag, index) => {
  tag.style.animationDelay = `${index * 0.1}s`;
  tag.addEventListener('mouseenter', () => {
    tag.style.animation = 'none';
    setTimeout(() => {
      tag.style.animation = '';
    }, 10);
  });
});

// ========================================
// Navigation Background on Scroll
// ========================================
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    nav.style.background = 'rgba(10, 10, 10, 0.95)';
    nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
  } else {
    nav.style.background = 'rgba(10, 10, 10, 0.8)';
    nav.style.boxShadow = 'none';
  }
});

// ========================================
// Page Transition (Optional)
// ========================================
document.querySelectorAll('a:not([href^="#"])').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    
    if (href && !href.startsWith('#')) {
      e.preventDefault();
      
      // Add page transition effect
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    }
  });
});

// ========================================
// Performance Optimization
// ========================================
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      parallaxScroll();
      revealOnScroll();
      ticking = false;
    });
    
    ticking = true;
  }
});

// ========================================
// Console Easter Egg
// ========================================
console.log('%c🎨 Welcome to the Portfolio!', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cBuilt with passion and creativity ✨', 'font-size: 14px; color: #b3b3b3;');

// ========================================
// Initialize Everything
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio initialized successfully!');
  
  // Add loaded class to body for any CSS transitions
  document.body.classList.add('loaded');
});

// ========================================
// Responsive Menu Toggle (Mobile)
// ========================================
const createMobileMenu = () => {
  const menuToggle = document.createElement('button');
  menuToggle.className = 'menu-toggle';
  menuToggle.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;
  
  const navLinksContainer = document.querySelector('.nav-links');
  
  if (window.innerWidth <= 768) {
    menuToggle.style.display = 'block';
    navLinksContainer.style.display = 'none';
    
    menuToggle.addEventListener('click', () => {
      navLinksContainer.style.display = 
        navLinksContainer.style.display === 'flex' ? 'none' : 'flex';
    });
  } else {
    menuToggle.style.display = 'none';
    navLinksContainer.style.display = 'flex';
  }
  
  document.querySelector('.nav').appendChild(menuToggle);
};

createMobileMenu();

window.addEventListener('resize', createMobileMenu);

// ========================================
// Image Lazy Loading
// ========================================
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));

// ========================================
// Mouse Trail Effect (Optional Enhancement)
// ========================================
let trailElements = [];
const maxTrailLength = 10;

function createTrailElement(x, y) {
  const trail = document.createElement('div');
  trail.className = 'mouse-trail';
  trail.style.cssText = `
    position: fixed;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    pointer-events: none;
    z-index: 9998;
    left: ${x}px;
    top: ${y}px;
    opacity: 0.5;
    transition: opacity 0.5s, transform 0.5s;
  `;
  
  document.body.appendChild(trail);
  trailElements.push(trail);
  
  setTimeout(() => {
    trail.style.opacity = '0';
    trail.style.transform = 'scale(0.5)';
  }, 10);
  
  setTimeout(() => {
    trail.remove();
    trailElements = trailElements.filter(t => t !== trail);
  }, 500);
}

// Uncomment to enable mouse trail
// document.addEventListener('mousemove', (e) => {
//   if (Math.random() < 0.3) {
//     createTrailElement(e.clientX, e.clientY);
//   }
// });
