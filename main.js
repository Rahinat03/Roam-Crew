document.addEventListener('DOMContentLoaded', () => {
  // Reveal animations on scroll
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});

/* ============================================================
   ROAMCREW from V1— MAIN JAVASCRIPT
   ============================================================ */

'use strict';

// ── NAVBAR SCROLL ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── HAMBURGER MENU ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.querySelectorAll('span').forEach((s, i) => {
      s.style.transform = isOpen
        ? i === 0 ? 'translateY(7px) rotate(45deg)'
        : i === 1 ? 'scaleX(0)'
        : 'translateY(-7px) rotate(-45deg)'
        : '';
    });
  });
  // Close on nav link click (but not dropdown toggle)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      // Don't close if this is a dropdown toggle
      if (link.closest('.dropdown') && link.getAttribute('href') === '#') {
        return;
      }
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.querySelectorAll('span').forEach(s => s.style.transform = '');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.querySelectorAll('span').forEach(s => s.style.transform = '');
    }
  });
}

// ── MODAL HELPERS ─────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.remove('active');
    document.body.style.overflow = '';
  }
}
window.openModal  = openModal;
window.closeModal = closeModal;

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      closeModal(m.id);
    });
  }
});

// ── ADVENTURE CARD LIGHTBOX ───────────────────────────────
document.querySelectorAll('.adventure-card[data-lightbox]').forEach(card => {
  card.addEventListener('click', e => {
    // Allow "Book Now" button to work normally
    if (e.target.closest('.btn-primary')) return;

    const img = card.querySelector('.card-bg-img');
    const title = card.querySelector('.card-content h3');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');

    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
    }
    if (title && lightboxCaption) {
      lightboxCaption.textContent = title.textContent;
    }

    openModal('imageLightbox');
  });
});

// ── JOIN CREW MODAL ───────────────────────────────────────
window.openJoinModal = () => openModal('joinModal');

window.handleJoin = (e) => {
  e.preventDefault();
  closeModal('joinModal');
  showToast('🎉 You\'re in the crew! Check your inbox for your loyalty code.');
  e.target.reset();
};

// ── NOTIFY ME MODAL ───────────────────────────────────────
window.openNotifyModal = (tripDate) => {
  const sub = document.getElementById('notifyModalSub');
  if (sub) sub.textContent = `Be the first to know when the ${tripDate} trip drops. Reserve your spot in line.`;
  openModal('notifyModal');
};

window.handleNotify = (e) => {
  e.preventDefault();
  closeModal('notifyModal');
  showToast('🔔 You\'re on the list! We\'ll notify you the moment it drops.');
  e.target.reset();
};

// ── TOAST ─────────────────────────────────────────────────
function showToast(message) {
  const toast = document.getElementById('successToast');
  const msg   = document.getElementById('toastMessage');
  if (!toast) return;
  if (msg) msg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
window.showToast = showToast;

// ── SCROLL REVEAL ─────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── AUTO POPUP (Join Crew) ────────────────────────────────
const hasSeenPopup = sessionStorage.getItem('rc_popup_seen');
if (!hasSeenPopup) {
  setTimeout(() => {
    if (!document.querySelector('.modal-overlay.active')) {
      openJoinModal();
      sessionStorage.setItem('rc_popup_seen', '1');
    }
  }, 9000);
}

// ── CONTACT FORM TABS ─────────────────────────────────────
document.querySelectorAll('.form-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(target);
    if (panel) panel.classList.add('active');
  });
});

// ── GALLERY FILTER ────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach(item => {
      const cat = item.dataset.category || 'all';
      item.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
    });
  });
});

// ── SMOOTH HREF ANCHORS ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── SET ACTIVE NAV LINK ───────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const servicePages = ['corporate.html', 'family.html', 'individual.html'];

document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  let isActive = false;

  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    isActive = true;
  }

  // Keep Services dropdown active on service sub-pages
  if (servicePages.includes(currentPage) && href === '#') {
    isActive = true;
  }

  if (isActive) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

// ── PARALLAX HERO ─────────────────────────────────────────
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  window.addEventListener('scroll', () => {
    const translateY = window.scrollY * 0.35;
    heroVideo.style.transform = `translateY(${translateY}px)`;
  }, { passive: true });
}

// ── SERVICES DROPDOWN TOGGLE ──────────────────────────────
document.querySelectorAll('.dropdown > .nav-link').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const dropdown = toggle.closest('.dropdown');
    if (dropdown) {
      dropdown.classList.toggle('open');
    }
  });
});

console.log('%cRoamCrew 🌿 — Rooted in Ghana. Built for the World.', 
  'color:#c4622d;font-size:1rem;font-weight:700;');
