// =======================
// Fridge toggle logic
// =======================
const fridge = document.getElementById("fridge");
const card = document.getElementById("card");
const backBtn = document.getElementById("backBtn");
const fridgeText = document.getElementById("fridge-text");

if (fridge && card && backBtn && fridgeText) {
  fridge.addEventListener("click", () => {
    fridge.classList.add("hidden");
    fridgeText.classList.add("hidden"); // hide text smoothly
    card.classList.remove("hidden");
  });

  backBtn.addEventListener("click", () => {
    fridge.classList.remove("hidden");
    fridgeText.classList.remove("hidden"); // show text again
    card.classList.add("hidden");
  });
}

// =======================
// Project Carousel logic
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".project-scroll");
  const scrollHint = document.getElementById("scroll-hint"); // 👈 scroll hint element
  if (!container) return; // exit if not on Projects page

  const cards = Array.from(container.querySelectorAll(".project-card"));
  if (!cards.length) return;

  let ticking = false;

  // Find which card is closest to center
  function updateActive() {
    ticking = false;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closest = null;
    let closestDist = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = card;
      }
    });

    cards.forEach((c) => c.classList.remove("active"));
    if (closest) closest.classList.add("active");
  }

  // Allow vertical scroll → horizontal scroll
  container.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    },
    { passive: false }
  );

  // Throttle scroll updates with requestAnimationFrame
  container.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActive();
          checkHint(); // 👈 also check scroll hint
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // Keyboard navigation
  function scrollToCard(index) {
    const card = cards[index];
    if (!card) return;
    const offset = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
    container.scrollTo({ left: offset, behavior: "smooth" });
  }

  document.addEventListener("keydown", (e) => {
    const activeIndex = cards.findIndex((c) => c.classList.contains("active"));
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToCard(Math.min(cards.length - 1, activeIndex + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToCard(Math.max(0, activeIndex - 1));
    }
  });

  // Swipe navigation (for touch devices)
  let startX = 0;
  let isSwiping = false;

  container.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  });

  container.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;
    const deltaX = e.touches[0].clientX - startX;

    if (Math.abs(deltaX) > 50) {
      const activeIndex = cards.findIndex((c) => c.classList.contains("active"));
      if (deltaX < 0) {
        scrollToCard(Math.min(cards.length - 1, activeIndex + 1));
      } else {
        scrollToCard(Math.max(0, activeIndex - 1));
      }
      isSwiping = false;
    }
  });

  container.addEventListener("touchend", () => {
    isSwiping = false;
  });

  // =======================
  // Scroll Hint logic
  // =======================
  function checkHint() {
    if (!scrollHint || !cards[1]) return;
    const secondCard = cards[1];
    const rect = secondCard.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // If second card passes halfway → fade out
    if (rect.left < containerRect.left + containerRect.width / 2) {
      scrollHint.classList.add("fade-out");
    } else {
      scrollHint.classList.remove("fade-out");
    }
  }

  // Recalculate on resize
  window.addEventListener("resize", () => {
    clearTimeout(window.__carouselResizeTimer__);
    window.__carouselResizeTimer__ = setTimeout(() => {
      updateActive();
      checkHint();
    }, 120);
  });

  // On load: center the first card
  window.addEventListener("load", () => {
    updateActive();
    const firstCard = cards[0];
    if (firstCard) {
      const offset = firstCard.offsetLeft - (container.clientWidth - firstCard.clientWidth) / 2;
      container.scrollTo({ left: offset, behavior: "instant" });
    }
    setTimeout(() => {
      updateActive();
      checkHint();
    }, 300);
  });

  // Initial run
  updateActive();
  checkHint();
});
