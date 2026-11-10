const test = require("node:test");
const assert = require("node:assert/strict");
const { filterSkills, isValidSkill } = require("./skills-utils");

const skills = [
  { title: "Photography Basics", description: "Learn lighting", category: "Creative", provider: "Jordan", price: 15 },
  { title: "Website Building", description: "HTML and CSS", category: "Tech", provider: "Alex", price: 20 },
  { title: "Everyday Cooking", description: "Kitchen basics", category: "Life", provider: "Sam", price: 12 }
];

test("returns all skills when query and category are unrestricted", () => {
  assert.equal(filterSkills(skills).length, 3);
});

test("filters by category without case sensitivity", () => {
  assert.deepEqual(filterSkills(skills, "", "tEcH").map(x => x.title), ["Website Building"]);
});

test("searches title, description, category, and provider", () => {
  assert.deepEqual(filterSkills(skills, "jordan").map(x => x.title), ["Photography Basics"]);
  assert.deepEqual(filterSkills(skills, "html").map(x => x.title), ["Website Building"]);
});

test("combines category and search filters", () => {
  assert.deepEqual(filterSkills(skills, "basics", "life").map(x => x.title), ["Everyday Cooking"]);
});

test("returns an empty list when there are no matches", () => {
  assert.equal(filterSkills(skills, "underwater basket weaving").length, 0);
});

test("accepts a complete listing with a zero price", () => {
  assert.equal(isValidSkill({ title: "Resume Help", description: "Review a resume", category: "Career", provider: "Taylor", price: 0 }), true);
});

test("rejects missing fields and negative or invalid prices", () => {
  assert.equal(isValidSkill({ title: "A", description: "B", category: "C", provider: "D", price: -1 }), false);
  assert.equal(isValidSkill({ title: "", description: "B", category: "C", provider: "D", price: 5 }), false);
  assert.equal(isValidSkill(null), false);
});
