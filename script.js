// =======================
// Fridge toggle logic
// =======================
const fridge = document.getElementById("fridge");
const card = document.getElementById("card");
const backBtn = document.getElementById("backBtn");

if (fridge && card && backBtn) {
  fridge.addEventListener("click", () => {
    fridge.classList.add("hidden");
    card.classList.remove("hidden");
    backBtn.classList.add("hidden");
  });

  backBtn.addEventListener("click", () => {
    card.classList.add("hidden");
    fridge.classList.remove("hidden");
    backBtn.classList.add("hidden");
  });
}

// =======================
// Project Carousel logic
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".project-scroll");
  if (!container) {
    console.warn("Carousel: .project-scroll not found. Check your HTML class name.");
    return;
  }

  const cards = Array.from(container.querySelectorAll(".project-card"));
  if (!cards.length) {
    console.warn("Carousel: no .project-card elements found inside .project-scroll.");
    return;
  }

  console.log(`Carousel: found ${cards.length} cards — script active.`);

  let ticking = false;

  // Helper: find which card is closest to the container center and update .active
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

  // Mouse wheel → horizontal scroll
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

  // Throttled scroll handler using rAF
  container.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActive);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Keyboard navigation: left / right arrows
  function scrollToCard(index) {
    const card = cards[index];
    if (!card) return;
    const offset = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
    container.scrollTo({ left: offset, behavior: "smooth" });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const activeIndex = cards.findIndex((c) => c.classList.contains("active"));
      let nextIndex = activeIndex;
      if (e.key === "ArrowRight")
        nextIndex = Math.min(cards.length - 1, activeIndex === -1 ? 0 : activeIndex + 1);
      else nextIndex = Math.max(0, activeIndex === -1 ? 0 : activeIndex - 1);
      scrollToCard(nextIndex);
    }
  });

  // Update on resize (layout changes)
  window.addEventListener("resize", () => {
    clearTimeout(window.__carouselResizeTimer__);
    window.__carouselResizeTimer__ = setTimeout(updateActive, 120);
  });

  // On load → center the first active card
  window.addEventListener("load", () => {
    updateActive();
    const activeCard = cards.find((c) => c.classList.contains("active")) || cards[0];
    if (activeCard) {
      const offset =
        activeCard.offsetLeft - (container.clientWidth - activeCard.clientWidth) / 2;
      container.scrollTo({ left: offset, behavior: "instant" });
    }
    setTimeout(updateActive, 300); // re-check after layout settles
  });

  // initial run
  updateActive();
});

