// SkillSwap MVP: search, category filtering, listing details, listing creation,
// and optional backend integration with a clear local-demo fallback.
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".skill-grid");
  const filterButtons = [...document.querySelectorAll(".filter-chip")];
  const count = document.querySelector("#skill-count");
  const skills = [...grid.querySelectorAll(".skill-card")].map((card, index) => ({
    id: `demo-${index + 1}`,
    title: card.querySelector("h3").textContent,
    description: card.querySelector(".skill-content > p").textContent,
    category: card.dataset.category,
    price: Number((card.querySelector(".price").textContent.match(/[0-9.]+/) || ["0"])[0]),
    provider: card.querySelector(".provider strong").textContent,
    details: card.querySelector(".card-extra").textContent
  }));

  let selectedCategory = "all";
  let searchTerm = "";
  let apiAvailable = false;
  const status = document.createElement("p");
  status.id = "app-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.className = "interaction-hint";
  document.querySelector(".skills-section .section-heading").after(status);

  const searchWrap = document.createElement("label");
  searchWrap.className = "skill-search";
  searchWrap.textContent = "Search skills";
  const search = document.createElement("input");
  search.type = "search";
  search.placeholder = "Try photography, cooking, web development...";
  search.setAttribute("aria-label", "Search skill listings");
  searchWrap.append(search);
  document.querySelector(".filter-row").before(searchWrap);

  const form = document.createElement("form");
  form.id = "create-skill-form";
  form.className = "create-skill-form";
  form.innerHTML = `
    <h3>Share a skill</h3>
    <div class="form-grid">
      <label>Skill title<input name="title" maxlength="80" required></label>
      <label>Category<input name="category" maxlength="40" required></label>
      <label>Provider name<input name="provider" maxlength="60" required></label>
      <label>Price per session ($)<input name="price" type="number" min="0" max="10000" step="0.01" required></label>
      <label class="form-wide">Description<textarea name="description" maxlength="500" rows="3" required></textarea></label>
    </div>
    <button class="button button-primary" type="submit">Publish skill</button>
  `;
  document.querySelector("#offer").append(form);

  function normalizeCategory(value) {
    return String(value || "").trim().toLowerCase();
  }

  function matches(skill) {
    const category = normalizeCategory(skill.category);
    const aliases = {
      creative: ["creative", "photography", "music", "illustration", "art", "design"],
      tech: ["tech", "programming", "web development", "electronics", "technology"],
      life: ["life", "cooking", "career", "language", "everyday life"]
    };
    const categoryMatch = selectedCategory === "all" ||
      category === selectedCategory ||
      (aliases[selectedCategory] || []).some(alias => category.includes(alias));
    const haystack = [skill.title, skill.description, skill.category, skill.provider]
      .join(" ").toLowerCase();
    return categoryMatch && haystack.includes(searchTerm);
  }

  function updateVisibility() {
    let visible = 0;
    [...grid.children].forEach(card => {
      const isVisible = matches(card.skillData || {
        title: card.querySelector("h3")?.textContent || "",
        description: card.querySelector(".skill-content > p")?.textContent || "",
        category: card.dataset.category || "",
        provider: card.querySelector(".provider strong")?.textContent || ""
      });
      card.hidden = !isVisible;
      if (isVisible) visible += 1;
    });
    count.textContent = `Showing ${visible} ${visible === 1 ? "skill" : "skills"}`;
    if (visible === 0) status.textContent = "No skills match your search. Try another word or category.";
    else if (status.dataset.kind !== "error") status.textContent = apiAvailable
      ? "Showing live listings from the SkillSwap API."
      : "Demo mode: showing sample listings. Connect the API to load shared listings.";
  }

  function renderSkill(skill) {
    const article = document.createElement("article");
    article.className = "skill-card";
    article.dataset.category = normalizeCategory(skill.category);
    article.tabIndex = 0;
    article.setAttribute("role", "button");
    article.setAttribute("aria-expanded", "false");
    article.skillData = skill;

    const visual = document.createElement("div");
    visual.className = "skill-visual visual-lavender";
    const symbol = document.createElement("span");
    symbol.className = "visual-symbol";
    symbol.textContent = "✳";
    const category = document.createElement("span");
    category.className = "visual-label";
    category.textContent = String(skill.category || "SKILL").toUpperCase();
    visual.append(symbol, category);

    const content = document.createElement("div");
    content.className = "skill-content";
    const meta = document.createElement("div");
    meta.className = "skill-meta";
    const categoryText = document.createElement("span");
    categoryText.textContent = skill.category;
    const rating = document.createElement("span");
    rating.className = "rating";
    rating.textContent = "COMMUNITY";
    meta.append(categoryText, rating);

    const title = document.createElement("h3");
    title.textContent = skill.title;
    const description = document.createElement("p");
    description.textContent = skill.description;
    const footer = document.createElement("div");
    footer.className = "skill-footer";
    const provider = document.createElement("div");
    provider.className = "provider";
    const avatar = document.createElement("span");
    avatar.className = "provider-avatar avatar-lavender";
    avatar.textContent = String(skill.provider || "S").split(/\\s+/).map(x => x[0]).join("").slice(0,2).toUpperCase();
    const providerName = document.createElement("strong");
    providerName.textContent = skill.provider || "Community member";
    const providerLabel = document.createElement("small");
    providerLabel.textContent = "Skill provider";
    const providerText = document.createElement("span");
    providerText.append(providerName, providerLabel);
    provider.append(avatar, providerText);
    const price = document.createElement("span");
    price.className = "price";
    price.textContent = `$${Number(skill.price).toFixed(2)} / session`;
    footer.append(provider, price);

    const extra = document.createElement("div");
    extra.className = "card-extra";
    extra.textContent = skill.details || "Contact the provider to learn more about this skill.";
    content.append(meta, title, description, footer, extra);
    article.append(visual, content);
    article.addEventListener("click", () => toggleCard(article));
    article.addEventListener("keydown", event => {
      if (event.target === article && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        toggleCard(article);
      }
    });
    return article;
  }

  function toggleCard(card) {
    const expanded = card.classList.toggle("expanded");
    card.setAttribute("aria-expanded", String(expanded));
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.filter;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      updateVisibility();
    });
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  });

  search.addEventListener("input", () => {
    searchTerm = search.value.trim().toLowerCase();
    updateVisibility();
  });

  grid.querySelectorAll(".skill-card").forEach(card => {
    card.addEventListener("click", () => toggleCard(card));
    card.addEventListener("keydown", event => {
      if (event.target === card && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        toggleCard(card);
      }
    });
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const data = new FormData(form);
    const skill = {
      title: String(data.get("title")).trim(),
      category: String(data.get("category")).trim(),
      provider: String(data.get("provider")).trim(),
      description: String(data.get("description")).trim(),
      price: Number(data.get("price"))
    };
    if (!window.SkillSwapUtils.isValidSkill(skill)) {
      status.dataset.kind = "error";
      status.textContent = "Please complete every field with a valid non-negative price.";
      return;
    }

    const apiBase = window.SKILLSWAP_API_URL || "http://localhost:3000/api/skills";
    if (apiAvailable) {
      try {
        const response = await fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(skill)
        });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const saved = await response.json();
        grid.prepend(renderSkill(saved));
        status.dataset.kind = "success";
        status.textContent = "Your skill listing was saved to the SkillSwap API.";
      } catch (error) {
        status.dataset.kind = "error";
        status.textContent = "We couldn't save your listing to the server. Please try again when the API is available.";
        return;
      }
    } else {
      grid.prepend(renderSkill(skill));
      status.dataset.kind = "success";
      status.textContent = "Your listing was added to this demo session. It will not persist after reloading.";
    }
    form.reset();
    updateVisibility();
  });

  async function loadSkills() {
    const apiBase = window.SKILLSWAP_API_URL || "http://localhost:3000/api/skills";
    try {
      const response = await fetch(apiBase, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const records = await response.json();
      if (!Array.isArray(records)) throw new Error("Unexpected API response");
      apiAvailable = true;
      grid.replaceChildren(...records.map(renderSkill));
      status.dataset.kind = "success";
      status.textContent = "Connected to the SkillSwap API. Listings are loaded from the database.";
    } catch (error) {
      apiAvailable = false;
      status.dataset.kind = "info";
      status.textContent = "API unavailable — running with sample listings. Start the backend to enable shared, saved listings.";
    }
    updateVisibility();
  }

  updateVisibility();
  loadSkills();
});
