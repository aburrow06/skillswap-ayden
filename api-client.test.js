const test = require("node:test");
const assert = require("node:assert/strict");
const { createServer } = require("node:http");
const { createClient } = require("./api-client");

async function withServer(t, handler) {
  const server = createServer(handler);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(() => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  }));
  return `http://127.0.0.1:${server.address().port}/api/skills`;
}

test("API integration: GET returns a list of skills", async t => {
  const expected = [{ id: 1, title: "Photography", price: 15 }];
  const url = await withServer(t, (req, res) => {
    assert.equal(req.method, "GET");
    assert.equal(req.url, "/api/skills");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(expected));
  });

  assert.deepEqual(await createClient(url).getSkills(), expected);
});

test("API integration: POST sends JSON and returns the saved listing", async t => {
  const expected = { id: 7, title: "Cooking", description: "Kitchen basics", category: "Life", provider: "Sam", price: 12 };
  const url = await withServer(t, async (req, res) => {
    assert.equal(req.method, "POST");
    assert.equal(req.headers["content-type"], "application/json");
    let body = "";
    for await (const chunk of req) body += chunk;
    assert.deepEqual(JSON.parse(body), {
      title: "Cooking", description: "Kitchen basics", category: "Life", provider: "Sam", price: 12
    });
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(expected));
  });

  assert.deepEqual(await createClient(url).createSkill({
    title: "Cooking", description: "Kitchen basics", category: "Life", provider: "Sam", price: 12
  }), expected);
});

test("API error handling: non-success HTTP responses are rejected", async t => {
  const url = await withServer(t, (_req, res) => {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Database unavailable" }));
  });

  await assert.rejects(createClient(url).getSkills(), /status 500/);
});

test("API error handling: malformed response shapes are rejected", async t => {
  const url = await withServer(t, (_req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ skills: [] }));
  });

  await assert.rejects(createClient(url).getSkills(), /invalid skills list/);
});

test("API client rejects an empty URL", () => {
  assert.throws(() => createClient(" "), /non-empty SkillSwap API URL/);
});
