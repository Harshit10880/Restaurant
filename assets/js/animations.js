/**
 * animations.js — Awwwards-Style Premium Animations
 * Powers: Lenis Smooth Scroll, Custom Magnetic Cursor,
 *         GSAP ScrollTrigger Reveals, SplitType Hero,
 *         VanillaTilt Menu Cards, Parallax, Bullet Highlights
 */

/* ============================================================
   WAIT FOR DOM
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. SMOOTH SCROLL — native browser smooth scroll
        (Lenis removed — it was causing scroll blocking issues)
  ---------------------------------------------------------- */

  // Smooth anchor scrolling for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });



  /* ----------------------------------------------------------
     2. CUSTOM MAGNETIC CURSOR (Desktop / hover-capable only)
  ---------------------------------------------------------- */
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (!isTouchDevice) {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');

    // Set initial state invisible until first mouse move
    gsap.set([dot, outline], { opacity: 0 });

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows instantly
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.05,
        ease: 'none',
        overwrite: true,
        opacity: 1,
      });

      // Outline follows with lag
      gsap.to(outline, {
        x: mouseX,
        y: mouseY,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: true,
        opacity: 1,
      });
    });

    // Hover effect on interactive elements
    const magneticEls = document.querySelectorAll(
      'a, button, .btn-get-started, .btn-getstarted, .nav-link, .menu-item, .more-btn, #scroll-top'
    );

    magneticEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        outline.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        outline.classList.remove('hovered');
      });
    });

    // Magnetic pull on buttons & CTA
    const magneticBtns = document.querySelectorAll(
      '.btn-get-started, .btn-getstarted, .more-btn, form button[type="submit"]'
    );

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        const dx = (e.clientX - bx) * 0.35;
        const dy = (e.clientY - by) * 0.35;

        gsap.to(btn, {
          x: dx, y: dy,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: true,
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0, y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
          overwrite: true,
        });
      });
    });
  }


  /* ----------------------------------------------------------
     3. GLASSMORPHISM NAVBAR ON SCROLL
  ---------------------------------------------------------- */
  const header = document.getElementById('header');

  ScrollTrigger.create({
    start: 'top -80px',
    onEnter: () => header.classList.add('scrolled-glass'),
    onLeaveBack: () => header.classList.remove('scrolled-glass'),
  });


  /* ----------------------------------------------------------
     4. HERO SECTION — SplitType Text Reveal + Mouse Parallax
  ---------------------------------------------------------- */
  const heroH1 = document.querySelector('.hero h1');

  if (heroH1 && typeof SplitType !== 'undefined') {
    const split = new SplitType(heroH1, { types: 'words,chars' });

    gsap.from(split.chars, {
      y: 60,
      opacity: 0,
      rotateX: -40,
      stagger: 0.028,
      duration: 0.85,
      ease: 'back.out(1.7)',
      delay: 0.3,
    });
  }

  // Hero sub-elements stagger in
  const heroP = document.querySelector('.hero p');
  const heroBtns = document.querySelector('.hero .d-flex');

  const heroTl = gsap.timeline({ delay: 0.6 });
  if (heroP) heroTl.from(heroP, { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.5);
  if (heroBtns) heroTl.from(heroBtns, { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.75);

  // Hero image — mouse parallax
  const heroImg = document.querySelector('.hero-img img');
  if (heroImg && !isTouchDevice) {
    document.querySelector('.hero')?.addEventListener('mousemove', (e) => {
      const rect = document.querySelector('.hero').getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;

      gsap.to(heroImg, {
        rotateY: dx * 12,
        rotateX: -dy * 8,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: true,
      });
    });

    document.querySelector('.hero')?.addEventListener('mouseleave', () => {
      gsap.to(heroImg, {
        rotateY: 0, rotateX: 0,
        duration: 1, ease: 'elastic.out(1, 0.4)',
      });
    });
  }


  /* ----------------------------------------------------------
     5. GSAP SCROLLTRIGGER — UNIVERSAL SECTION REVEALS
        Replaces all AOS fade-up animations
  ---------------------------------------------------------- */

  // Helper: create a standard reveal animation
  function revealFromBottom(targets, options = {}) {
    const els = gsap.utils.toArray(targets);
    if (!els.length) return;

    els.forEach((el, i) => {
      gsap.from(el, {
        y: options.y ?? 55,
        opacity: 0,
        duration: options.dur ?? 0.85,
        delay: options.stagger ? i * options.stagger : (options.delay ?? 0),
        ease: options.ease ?? 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  function revealFromSide(targets, direction = 'left') {
    const els = gsap.utils.toArray(targets);
    if (!els.length) return;

    els.forEach((el) => {
      gsap.from(el, {
        x: direction === 'left' ? -60 : 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  // Section titles
  revealFromBottom('.section-title h2');
  revealFromBottom('.section-title p', { delay: 0.15 });

  // About
  revealFromSide('.about .col-lg-7', 'left');
  revealFromSide('.about .col-lg-5', 'right');
  revealFromBottom('.about .book-a-table');

  // Why Us
  revealFromSide('.why-us .why-box', 'left');
  revealFromBottom('.why-us .icon-box', { stagger: 0.12 });

  // Stats
  revealFromBottom('.stats-item', { stagger: 0.1 });

  // Menu items (all tabs)
  revealFromBottom('.menu-item', { stagger: 0.08, y: 40 });

  // Chefs
  revealFromBottom('.team-member', { stagger: 0.12, y: 50 });

  // Book a table form
  revealFromSide('.reservation-img', 'left');
  revealFromSide('.reservation-form-bg', 'right');

  // Gallery
  revealFromBottom('.gallery .swiper', { y: 30 });

  // Contact info items
  revealFromBottom('.info-item', { stagger: 0.1 });
  revealFromBottom('.contact form', { delay: 0.25 });


  /* ----------------------------------------------------------
     6. ABOUT SECTION — SECONDARY IMAGE PARALLAX
        about-2.jpg moves at 60% scroll speed (slower = depth)
  ---------------------------------------------------------- */
  const aboutImg2 = document.querySelector('.about .position-relative');

  if (aboutImg2) {
    gsap.to(aboutImg2, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: aboutImg2,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
    aboutImg2.classList.add('about-img-secondary');
  }

  // Also parallax the main about image slightly
  const aboutImg1 = document.querySelector('.about .col-lg-7 img');
  if (aboutImg1) {
    gsap.to(aboutImg1, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: aboutImg1,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });
  }


  /* ----------------------------------------------------------
     7. ABOUT BULLETS — SCROLL-LINKED HIGHLIGHT
  ---------------------------------------------------------- */
  const aboutLis = gsap.utils.toArray('.about ul li');

  aboutLis.forEach((li, i) => {
    ScrollTrigger.create({
      trigger: li,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(li, {
          color: 'var(--accent-color)',
          x: 6,
          duration: 0.4,
          ease: 'power2.out',
        });
      },
    });
  });


  /* ----------------------------------------------------------
     8. VANILLA TILT — MENU CARDS (Desktop Only)
  ---------------------------------------------------------- */
  if (!isTouchDevice && typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.menu-item'), {
      max: 10,
      speed: 400,
      glare: true,
      'max-glare': 0.12,
      perspective: 900,
      scale: 1.03,
      transition: true,
    });
  }


  /* ----------------------------------------------------------
     9. EVENTS SECTION — SWIPER SLIDES PARALLAX OVERLAY
  ---------------------------------------------------------- */
  const eventItems = gsap.utils.toArray('.event-item');
  revealFromBottom(eventItems, { stagger: 0 }); // handled by Swiper


  /* ----------------------------------------------------------
     10. STATS COUNTER – ensure it fires after scroll reveal
  ---------------------------------------------------------- */
  // PureCounter is already initialized in main.js — no conflict


  /* ----------------------------------------------------------
     11. WHY US "WHY BOX" — ANIMATE THE BUTTON
  ---------------------------------------------------------- */
  revealFromBottom('.more-btn', { delay: 0.3 });


  /* ----------------------------------------------------------
     12. SCROLL TOP BUTTON — GSAP MANAGED
  ---------------------------------------------------------- */
  const scrollTop = document.getElementById('scroll-top');
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo(0, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    });
  }

  // Smooth anchor scrolling via Lenis (override default # links)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -100, duration: 1.6 });
      }
    });
  });


  /* ----------------------------------------------------------
     13. FOOTER — FADE IN
  ---------------------------------------------------------- */
  revealFromBottom('.footer', { y: 20 });

}); // end DOMContentLoaded
