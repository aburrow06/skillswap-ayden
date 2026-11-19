// Small API client shared by the browser application and integration tests.
(function (root) {
  function createClient(baseUrl, fetchImpl) {
    if (typeof baseUrl !== "string" || !baseUrl.trim()) {
      throw new TypeError("A non-empty SkillSwap API URL is required.");
    }

    const request = fetchImpl || (typeof fetch === "function" ? fetch.bind(root) : null);
    if (typeof request !== "function") {
      throw new Error("Fetch is not available in this environment.");
    }

    async function send(path, options) {
      const response = await request(`${baseUrl.replace(/\/$/, "")}${path}`, options);
      if (!response.ok) {
        throw new Error(`SkillSwap API request failed with status ${response.status}.`);
      }
      return response.json();
    }

    return {
      async getSkills() {
        const skills = await send("", {
          headers: { Accept: "application/json" }
        });
        if (!Array.isArray(skills)) {
          throw new Error("The SkillSwap API returned an invalid skills list.");
        }
        return skills;
      },

      async createSkill(skill) {
        const savedSkill = await send("", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(skill)
        });
        if (!savedSkill || typeof savedSkill !== "object" || Array.isArray(savedSkill)) {
          throw new Error("The SkillSwap API returned an invalid saved listing.");
        }
        return savedSkill;
      }
    };
  }

  const api = { createClient };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.SkillSwapApiClient = api;
})(typeof window !== "undefined" ? window : globalThis);
