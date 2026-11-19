# SkillSwap — Full-Stack Skill-Sharing MVP

SkillSwap is a community skill-sharing application. Visitors can browse example listings, search by keyword, filter by category, expand listing details, and submit a new listing. The frontend connects to a companion Express/Sequelize API when it is available. If no API is reachable, it clearly switches to a non-persistent demo mode.

## Repository structure

- `index.html` — semantic page structure and responsive interface
- `styles.css` — responsive styling and mobile layouts
- `script.js` — browser interactions, filtering, rendering, and form handling
- `skills-utils.js` — pure search/filter and listing-validation helpers
- `api-client.js` — reusable HTTP client for GET and POST requests
- `skills-utils.test.js` — unit tests for search, filtering, and validation
- `api-client.test.js` — HTTP integration tests for the API client
- `TESTING.md` — automated test instructions, manual end-to-end checklist, troubleshooting, and design patterns
- `.github/workflows/` — automated checks and GitHub Pages deployment

## Run the frontend locally

1. Clone this repository.
2. Open the folder in VS Code.
3. Start VS Code Live Server, or use another local HTTP server.
4. Open the local URL shown by the server.

Without the backend, the app displays sample listings. New listings are added to the current page session only and do not persist after refresh.

## Run the companion backend

The companion API repository is [COMPSIX-skill-swap-backend](https://github.com/RizeComputerScience/COMPSIX-skill-swap-backend).

1. Clone the backend repository and open its folder.
2. Run `npm install`.
3. Create a `.env` file with `DB_STORAGE=./database.sqlite` and `PORT=3000`.
4. Run `npm run setup` to create the SQLite database and sample records.
5. Run `npm start`; the API listens on port 3000.
6. Serve the frontend over HTTP. The default API endpoint is `http://localhost:3000/api/skills`.

For a hosted backend, set `window.SKILLSWAP_API_URL` before `script.js` loads. Configure the backend CORS policy to allow the deployed frontend origin. SQLite files on ephemeral hosting services may be lost during redeploys unless persistent storage is configured.

### API endpoints

- `GET /api/skills` — returns the list of available skills as JSON.
- `POST /api/skills` — creates a listing and returns the saved record.

## Automated testing

Run from the frontend repository root:

```bash
node --check script.js
node --check api-client.js
node --check skills-utils.js
node --test *.test.js
```

The test suite includes unit tests for filtering/search/validation and HTTP integration tests for successful GET/POST requests, server errors, and unexpected response shapes. See [TESTING.md](TESTING.md) for the manual end-to-end checklist and troubleshooting guide.

GitHub Actions runs the automated checks for pull requests targeting `main` and pushes to `main`. The Pages deployment workflow also runs the checks before deploying the static frontend.

## Architecture and design patterns

The frontend separates semantic structure, styling, browser interaction, pure helpers, and API communication. The companion backend uses Express routes, Sequelize models, and SQLite persistence.

Two design patterns are used:
1. **Module Pattern:** the IIFE-based `skills-utils.js` and `api-client.js` modules expose small public APIs while keeping internal implementation details scoped.
2. **Factory Function Pattern:** `renderSkill(skill)` creates and returns a complete skill-card DOM element from a skill data object, including its content and interactions.

## Production deployment status and limitations

The GitHub Pages workflow deploys the static frontend. GitHub Pages does not host the Express API or SQLite database. The live frontend therefore needs a separately hosted backend and a configured `SKILLSWAP_API_URL` for persistent listings. If no production API is configured, the frontend remains usable in demo mode, but listings are not shared or saved between sessions.

The MVP does not include user accounts, authentication, messaging, payment processing, or moderation. Sample ratings and provider details are illustrative.

## AI assistance

AI assistance was used to help draft and revise portions of the implementation and documentation. The code, test results, and deployment settings should be reviewed before submission.
