
 // AI-assisted JavaScript: category filtering, accessible expandable skill cards,
// and a live count of visible skills.
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-chip");
  const skillCards = document.querySelectorAll(".skill-card");
  const skillCount = document.querySelector("#skill-count");

  // Update the count based on the currently visible skill cards.
  function updateSkillCount() {
    const visibleCards = Array.from(skillCards).filter(
      (card) => !card.hidden
    );

    const count = visibleCards.length;
    skillCount.textContent = `Showing ${count} ${count === 1 ? "skill" : "skills"}`;
  }

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
        const matches =
          selectedCategory === "all" ||
          card.dataset.category === selectedCategory;
        card.hidden = !matches;
      });

      updateSkillCount();
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
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

  // Set the initial count when the page loads.
  updateSkillCount();
});
