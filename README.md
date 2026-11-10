# SkillSwap MVP

SkillSwap is a community skill-sharing MVP. Users can browse example skill listings, search by keyword, filter by category, expand listing details, and submit a new listing. The frontend can load and create listings through the companion Express/Sequelize API; if the API is unavailable, it clearly switches to a non-persistent demo mode.

## Repository structure

- `index.html` — semantic page structure and responsive interface
- `styles.css` — responsive styling
- `script.js` — browser interactions and API integration
- `skills-utils.js` — pure search/filter and validation helpers
- `skills-utils.test.js` — automated unit tests using Node's built-in test runner

## Run the frontend

Open `index.html` in a browser, or use VS Code Live Server. Without the API, the site uses sample content and new listings exist only for the current page session.

## Connect the backend

The companion API repository is [COMPSIX-skill-swap-backend](https://github.com/RizeComputerScience/COMPSIX-skill-swap-backend).

1. In the backend repository, run `npm install`.
2. Run `npm run setup` to create the SQLite database and sample listings.
3. Run `npm start`; the API listens on port 3000.
4. Serve the frontend over HTTP (for example, with VS Code Live Server).
5. Set `window.SKILLSWAP_API_URL` before `script.js` loads if the API is hosted somewhere other than `http://localhost:3000/api/skills`.

The API supports `GET /api/skills` and `POST /api/skills`. When deploying, configure the hosted API URL and CORS for the frontend origin. SQLite storage on many ephemeral hosting services may not persist across redeploys unless a persistent disk is configured.

## Tests

Run:

```bash
node --test skills-utils.test.js
```

The tests cover unrestricted listing, case-insensitive category filtering, text search, combined filters, no-result behavior, and listing validation.

## Architecture

The frontend is organized into a small presentation layer (`index.html` and `styles.css`), a browser interaction/API layer (`script.js`), and pure helper functions (`skills-utils.js`). The backend follows a simple Express route/controller-to-Sequelize-model structure with SQLite persistence.

## Limitations

- Demo mode does not persist newly submitted listings.
- The sample ratings and provider information in the original starter cards are illustrative content.
- User accounts, authentication, messaging, payment processing, and moderation are outside this MVP.
- Deployment is not complete until the API is hosted, the frontend API URL is configured, and both live URLs are verified.

## AI assistance

AI assistance was used to help draft and revise portions of the implementation and documentation. Review the code, run the tests, and verify deployment settings before submitting.
