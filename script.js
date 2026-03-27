document.addEventListener("DOMContentLoaded", () => {
  initProcessGallery();
  initFaq();
  initEstimateCalculator();
});

function initProcessGallery() {
  const steps = document.querySelectorAll(".process-step");
  const slides = document.querySelectorAll(".process-slide");
  const navButtons = document.querySelectorAll("[data-process-nav]");
  let currentIndex = 0;

  if (!steps.length || !slides.length) {
    return;
  }

  const showSlide = (index) => {
    const safeIndex = Math.max(0, Math.min(index, steps.length - 1));
    currentIndex = safeIndex;

    steps.forEach((step, stepIndex) => {
      const isActive = stepIndex === safeIndex;
      step.classList.toggle("is-active", isActive);
      step.setAttribute("aria-pressed", String(isActive));
      step.tabIndex = isActive ? 0 : -1;
    });

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === safeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.hidden = !isActive;
    });

  };

  steps.forEach((step, index) => {
    step.addEventListener("click", () => showSlide(index));
    step.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        showSlide(index + 1);
        steps[Math.min(index + 1, steps.length - 1)]?.focus();
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        showSlide(index - 1);
        steps[Math.max(index - 1, 0)]?.focus();
      }
    });
  });

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.getAttribute("data-process-nav");
      const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
      showSlide(nextIndex);
    });
  });

  showSlide(0);
}

function initFaq() {
  const triggers = document.querySelectorAll(".faq-trigger");

  if (!triggers.length) {
    return;
  }

  const closeAll = () => {
    triggers.forEach((trigger) => {
      const item = trigger.closest(".faq-item");
      const panel = item?.querySelector(".faq-panel");
      trigger.setAttribute("aria-expanded", "false");

      if (panel) {
        panel.hidden = true;
      }
    });
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".faq-item");
      const panel = item?.querySelector(".faq-panel");
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      closeAll();

      if (!isExpanded && panel) {
        trigger.setAttribute("aria-expanded", "true");
        panel.hidden = false;
      }
    });
  });
}

function initEstimateCalculator() {
  const areaInput = document.querySelector('input[name="bath-area"]');
  const budgetOutput = document.querySelector('[data-estimate-tier="budget"]');
  const standardOutput = document.querySelector('[data-estimate-tier="standard"]');
  const premiumOutput = document.querySelector('[data-estimate-tier="premium"]');

  if (!areaInput || !budgetOutput || !standardOutput || !premiumOutput) {
    return;
  }

  const formatAmount = (value) => new Intl.NumberFormat("ru-RU").format(value);
  const formatRange = (min, max) => `${formatAmount(min)}-${formatAmount(max)} тыс. ₽`;

  const updateEstimate = () => {
    const area = Number(areaInput.value);
    const safeArea = Number.isFinite(area) && area > 0 ? area : 0;

    budgetOutput.textContent = formatRange(safeArea * 25, safeArea * 35);
    standardOutput.textContent = formatRange(safeArea * 35, safeArea * 55);
    premiumOutput.textContent = formatRange(safeArea * 55, safeArea * 80);
  };

  areaInput.addEventListener("input", updateEstimate);
  updateEstimate();
}
