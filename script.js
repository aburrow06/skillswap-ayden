// AI-assisted JavaScript: this adds category filtering and accessible expandable skill cards.
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-chip");
  const skillCards = document.querySelectorAll(".skill-card");

  // Show only cards matching the selected category.
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      skillCards.forEach((card) => {
        const matches = selectedCategory === "all" ||
          card.dataset.category === selectedCategory;
        card.hidden = !matches;
      });
    });
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  });

  // Clicking or keyboard-activating a card reveals extra session details.
  function toggleCard(card) {
    const expanded = card.classList.toggle("expanded");
    card.setAttribute("aria-expanded", String(expanded));
  }

  skillCards.forEach((card) => {
    card.addEventListener("click", () => toggleCard(card));
    card.addEventListener("keydown", (event) => {
      if (event.target !== card) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCard(card);
      }
    });
  });
});
