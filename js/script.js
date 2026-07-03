/* ===========================================================
   TOUCHÉ TRAVELS — shared script.js
   Mobile menu · scroll-to-top · reveal-on-scroll ·
   testimonial/image slider · form validation (contact + booking)
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- mobile menu ---------- */
  const toggle   = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const backdrop = document.querySelector('.nav-backdrop');

  if (toggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('is-open');
      backdrop && backdrop.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
      navLinks.classList.add('open');
      toggle.classList.add('is-open');
      backdrop && backdrop.classList.add('show');
      toggle.setAttribute('aria-expanded', 'true');
    };
    toggle.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });
    backdrop && backdrop.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 880) closeMenu(); });
  }

  /* ---------- mark active nav link ---------- */
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- scroll-to-top button ---------- */
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('show', window.scrollY > 500);
    });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- reveal-on-scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- simple testimonial slider ---------- */
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slide-group');
    const prevBtn = slider.querySelector('.slide-prev');
    const nextBtn = slider.querySelector('.slide-next');
    const dotsWrap = slider.querySelector('.slide-dots');
    let index = 0;

    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      if (dotsWrap) {
        [...dotsWrap.children].forEach((d, di) => d.classList.toggle('active', di === index));
      }
    }
    prevBtn && prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(index + 1));

    let autoplay = setInterval(() => goTo(index + 1), 6000);
    slider.addEventListener('mouseenter', () => clearInterval(autoplay));
    slider.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(index + 1), 6000); });
  }

  /* ---------- gallery filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    const items = document.querySelectorAll('[data-category]');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        items.forEach(item => {
          const itemCats = item.dataset.category.split(' ');
          const show = cat === 'all' || itemCats.includes(cat);
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- form validation (contact + booking) ---------- */
  const forms = document.querySelectorAll('[data-validate]');
  forms.forEach(form => {
    const successBox = form.parentElement.querySelector('.form-success');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[data-rule]').forEach(field => {
        const group = field.closest('.form-group');
        const rule  = field.dataset.rule;
        const value = field.value.trim();
        const errorEl = group.querySelector('.error-msg');
        let message = '';

        if (rule.includes('required') && value === '') {
          message = 'This field is required.';
        } else if (rule.includes('email') && value !== '') {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) message = 'Enter a valid email address.';
        } else if (rule.includes('phone') && value !== '') {
          const phonePattern = /^[0-9+\-\s()]{7,15}$/;
          if (!phonePattern.test(value)) message = 'Enter a valid phone number.';
        } else if (rule.includes('futuredate') && value !== '') {
          const chosen = new Date(value);
          const today = new Date();
          today.setHours(0,0,0,0);
          if (chosen < today) message = 'Please choose a future date.';
        } else if (rule.includes('minlength') && value !== '') {
          const min = parseInt(field.dataset.min || '10', 10);
          if (value.length < min) message = `Please enter at least ${min} characters.`;
        }

        if (message) {
          valid = false;
          group.classList.add('error');
          if (errorEl) errorEl.textContent = message;
        } else {
          group.classList.remove('error');
          if (errorEl) errorEl.textContent = '';
        }
      });

      if (valid) {
        form.reset();
        if (successBox) {
          successBox.classList.add('show');
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => successBox.classList.remove('show'), 6000);
        }
      }
    });

    /* live re-validation as the visitor fixes a field */
    form.querySelectorAll('[data-rule]').forEach(field => {
      field.addEventListener('input', () => {
        field.closest('.form-group').classList.remove('error');
      });
    });
  });

  /* ---------- current year in footer ---------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
