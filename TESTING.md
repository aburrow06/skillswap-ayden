# SkillSwap testing and troubleshooting

## Automated tests

Run all automated checks from the repository root:

```bash
node --check script.js
node --check api-client.js
node --check skills-utils.js
node --test *.test.js
```

- `skills-utils.test.js` tests search, category filtering, combined filters, empty results, and listing validation.
- `api-client.test.js` runs HTTP integration tests against a temporary local test server. It verifies the GET and POST request/response contract, non-success status handling, unexpected response shapes, and API URL validation.
- The integration tests do not claim that the separately hosted production API is available; they validate the frontend API client's HTTP behavior.

## Manual end-to-end test checklist

1. Open `index.html` using VS Code Live Server or another local HTTP server.
2. Confirm the sample cards appear and the status message identifies demo mode when the API is stopped.
3. Select Creative, Tech, Everyday life, and All skills. Confirm the visible count changes.
4. Search by a title, description word, category, and provider name. Confirm matching cards remain visible.
5. Expand a card with a mouse and with Enter/Space on the focused card. Confirm its details appear and `aria-expanded` changes.
6. Submit a complete skill with a zero or positive price in demo mode. Confirm it appears for the current page session and the status explains that it is not persistent.
7. Submit an incomplete listing or invalid price. Confirm the form displays a validation message and does not add a card.
8. Start the companion backend and database, configure `window.SKILLSWAP_API_URL` if needed, and reload. Confirm listings load from the API.
9. Submit a valid listing while the API is available. Confirm the saved response is added to the list.
10. Stop the backend or simulate a server error. Confirm the interface displays a helpful API error or demo-mode message rather than breaking.
11. Repeat at desktop, tablet, and mobile viewport widths. Confirm navigation, cards, and the listing form remain usable.

## Troubleshooting

- **Demo mode appears:** the default API URL is `http://localhost:3000/api/skills`. Start the backend or define `window.SKILLSWAP_API_URL` before `script.js` loads.
- **Browser CORS error:** configure the backend CORS policy to allow the frontend origin.
- **API returns an error:** check the backend terminal output, database connection, and request body.
- **New listings disappear after refresh:** demo mode is intentionally session-only. Persistent listings require a reachable API and working database.
- **SQLite data disappears after redeploy:** configure persistent storage on the backend host; ephemeral filesystems are not durable.

## Design patterns

1. **Module Pattern:** `skills-utils.js` and `api-client.js` use an immediately invoked function expression (IIFE) to keep implementation details scoped and expose a small public API. The same modules support browser globals and Node.js tests.
2. **Factory Function Pattern:** `renderSkill(skill)` in `script.js` accepts a skill data object, creates a complete DOM card, attaches its interactions, and returns the new element. The caller does not need to know the card's internal DOM construction.

## Architecture

The app separates semantic structure (`index.html`), presentation (`styles.css`), browser interaction and rendering (`script.js`), pure search/validation helpers (`skills-utils.js`), and HTTP communication (`api-client.js`). The companion backend uses Express routes, Sequelize models, and SQLite storage.
