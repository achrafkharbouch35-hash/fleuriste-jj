/* ==========================================================================
   LES FLEURS DE CHAIMAE — SITE SCRIPT
   Edit the CONFIG and GALLERY_ITEMS objects below to update business info
   ========================================================================== */

// ---------- CONFIG (edit here to update business info sitewide) ----------
const CONFIG = {
  whatsappNumber: "212605022401" // Moroccan format, no + or spaces
};

// ---------- GALLERY DATA (replace image URLs with real photos later) ----------
const GALLERY_ITEMS = [
  { img: "images/B1.jpg", category: "bouquets", title: "Bouquet Romantique" },
  { img: "images/M1.jpg", category: "mariages", title: "Bouquet de mariée" },
  { img: "images/D1.jpg", category: "decoration", title: "Décor de table événement" },
  { img: "images/B2.jpg", category: "bouquets", title: "Bouquet Élégance" },
  { img: "images/C1.jpg", category: "cadeaux", title: "Composition cadeau blanche" },
  { img: "images/A1.jpg", category: "anniversaires", title: "Décor d'anniversaire fleuri" },
  { img: "images/D2.jpg", category: "decoration", title: "Décor pour séance photo" },
  { img: "images/B3.jpg", category: "bouquets", title: "Bouquet de roses roses" },
  { img: "images/C2.jpg", category: "cadeaux", title: "Panier fleuri cadeau" },
  { img: "images/M2.jpg", category: "mariages", title: "Arche florale mariage" },
  { img: "images/A2.jpg", category: "anniversaires", title: "Ballons & fleurs anniversaire" },
  { img: "images/D3.jpg", category: "decoration", title: "Coin décoratif floral" }
];

const CATEGORY_LABELS = {
  bouquets: "Bouquets",
  mariages: "Mariages",
  anniversaires: "Anniversaires",
  decoration: "Décoration",
  cadeaux: "Cadeaux"
};

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- WhatsApp links: build proper wa.me URLs from data-wa-message ---------- */
  document.querySelectorAll(".whatsapp-link").forEach(link => {
    const message = link.getAttribute("data-wa-message") || "Bonjour Les Fleurs Fes 🌷";
    link.setAttribute("href", `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });

  /* ---------- Sticky navbar + blur on scroll ---------- */
  const navbar = document.getElementById("navbar");
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("navbar--solid");
      backToTop.classList.add("visible");
    } else {
      navbar.classList.remove("navbar--solid");
      backToTop.classList.remove("visible");
    }
    updateActiveNav();
  });

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
    document.body.classList.toggle("no-scroll", isOpen);
  });

  document.querySelectorAll(".mobile-menu__link").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("open");
      document.body.classList.remove("no-scroll");
    });
  });

  /* ---------- Smooth scrolling for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* ---------- Active nav link based on scroll position ---------- */
  const sections = document.querySelectorAll("section[id], section.hero");
  const navLinksEls = document.querySelectorAll(".nav-link");

  function updateActiveNav() {
    let currentId = "accueil";
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        currentId = section.id || currentId;
      }
    });
    navLinksEls.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  }

  /* ---------- Gallery rendering ---------- */
  const galleryGrid = document.getElementById("galleryGrid");

  function renderGallery(items) {
    galleryGrid.innerHTML = items.map((item, index) => `
      <figure class="gallery-item" data-category="${item.category}" data-index="${index}">
        <img src="${item.img}" alt="${item.title}" loading="lazy">
        <figcaption class="gallery-item__overlay">
          <span class="gallery-item__category">${CATEGORY_LABELS[item.category]}</span>
          <button class="gallery-item__heart" aria-label="Ajouter aux favoris"><i class="fa-regular fa-heart"></i></button>
          <button class="gallery-item__view" data-lightbox-index="${index}">Voir</button>
        </figcaption>
      </figure>
    `).join("");
    attachGalleryEvents();
  }

  renderGallery(GALLERY_ITEMS);

  /* ---------- Gallery filtering ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  let currentFilteredItems = GALLERY_ITEMS;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      galleryGrid.classList.add("fading");
      setTimeout(() => {
        currentFilteredItems = filter === "tous"
          ? GALLERY_ITEMS
          : GALLERY_ITEMS.filter(item => item.category === filter);
        renderGallery(currentFilteredItems);
        galleryGrid.classList.remove("fading");
      }, 200);
    });
  });

  /* ---------- Heart favorite toggle ---------- */
  function attachGalleryEvents() {
    document.querySelectorAll(".gallery-item__heart").forEach(heart => {
      heart.addEventListener("click", (e) => {
        e.stopPropagation();
        heart.classList.toggle("liked");
        heart.querySelector("i").classList.toggle("fa-regular");
        heart.querySelector("i").classList.toggle("fa-solid");
      });
    });

    document.querySelectorAll(".gallery-item__view").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(parseInt(btn.dataset.lightboxIndex, 10));
      });
    });

    document.querySelectorAll(".gallery-item").forEach(item => {
      item.addEventListener("click", () => {
        openLightbox(parseInt(item.dataset.index, 10));
      });
    });
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxCounter = document.getElementById("lightboxCounter");
  let lightboxIndex = 0;

  function openLightbox(index) {
    lightboxIndex = index;
    updateLightbox();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function updateLightbox() {
    const item = currentFilteredItems[lightboxIndex];
    lightboxImg.src = item.img.replace("w=700", "w=1400");
    lightboxImg.alt = item.title;
    lightboxCaption.textContent = `${item.title} — ${CATEGORY_LABELS[item.category]}`;
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${currentFilteredItems.length}`;
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  document.getElementById("lightboxNext").addEventListener("click", () => {
    lightboxIndex = (lightboxIndex + 1) % currentFilteredItems.length;
    updateLightbox();
  });
  document.getElementById("lightboxPrev").addEventListener("click", () => {
    lightboxIndex = (lightboxIndex - 1 + currentFilteredItems.length) % currentFilteredItems.length;
    updateLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") document.getElementById("lightboxNext").click();
    if (e.key === "ArrowLeft") document.getElementById("lightboxPrev").click();
  });

  /* ---------- Animated counters (Instagram stats) ---------- */
  const counters = document.querySelectorAll(".ig-stat__num");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString("fr-FR");
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("fr-FR");
    }
    requestAnimationFrame(step);
  }

  /* ---------- Testimonial slider ---------- */
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const testimonialDotsWrap = document.getElementById("testimonialDots");
  let testimonialIndex = 0;
  let testimonialTimer;

  testimonialCards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "testimonials__dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goToTestimonial(i));
    testimonialDotsWrap.appendChild(dot);
  });

  function goToTestimonial(index) {
    testimonialCards[testimonialIndex].classList.remove("active");
    testimonialDotsWrap.children[testimonialIndex].classList.remove("active");
    testimonialIndex = (index + testimonialCards.length) % testimonialCards.length;
    testimonialCards[testimonialIndex].classList.add("active");
    testimonialDotsWrap.children[testimonialIndex].classList.add("active");
  }

  document.getElementById("testimonialNext").addEventListener("click", () => {
    goToTestimonial(testimonialIndex + 1);
    resetTestimonialTimer();
  });
  document.getElementById("testimonialPrev").addEventListener("click", () => {
    goToTestimonial(testimonialIndex - 1);
    resetTestimonialTimer();
  });

  function resetTestimonialTimer() {
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(() => goToTestimonial(testimonialIndex + 1), 5500);
  }
  resetTestimonialTimer();

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Back to top ---------- */
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateActiveNav();
});
