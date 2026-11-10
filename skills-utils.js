// Pure helpers shared by the browser app and automated tests.
(function (root) {
  function filterSkills(skills, query = "", category = "all") {
    const normalizedQuery = String(query).trim().toLowerCase();
    const normalizedCategory = String(category).trim().toLowerCase();
    return skills.filter(skill => {
      const categoryMatch = normalizedCategory === "all" ||
        String(skill.category).trim().toLowerCase() === normalizedCategory;
      const searchable = [skill.title, skill.description, skill.category, skill.provider]
        .join(" ").toLowerCase();
      return categoryMatch && searchable.includes(normalizedQuery);
    });
  }

  function isValidSkill(skill) {
    return Boolean(skill &&
      typeof skill.title === "string" && skill.title.trim() &&
      typeof skill.description === "string" && skill.description.trim() &&
      typeof skill.category === "string" && skill.category.trim() &&
      typeof skill.provider === "string" && skill.provider.trim() &&
      Number.isFinite(Number(skill.price)) && Number(skill.price) >= 0);
  }

  const api = { filterSkills, isValidSkill };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.SkillSwapUtils = api;
})(typeof window !== "undefined" ? window : globalThis);
