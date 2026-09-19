# MaaProject QA Notes

## Final verification pass

Checked the project source after the final upgrade pass.

### Verified
- Dataset validation passes: CSV=110, supplied JSONL=88, complete JSONL=110.
- TypeScript source parsing produced no syntax/type-shape errors beyond missing installed dependency declarations in this environment.
- Fixed the Vite ESM `__dirname` issue by using `fileURLToPath(import.meta.url)`.
- Added account authentication using Node's built-in `crypto` (no extra auth package required).
- Added persistent user/conversation storage under `.data/`.
- Added persistent Knowledge Base and Support Ticket storage under `.data/`.
- Added authenticated conversation endpoints with user ownership checks.
- Chat requests now forward the signed-in session token when present.
- Added password hashing with `scrypt` and signed 30-day session tokens.
- Added production guard requiring `SESSION_SECRET` (32+ characters).
- Kept the existing landing/chat visual system and existing core pages intact.
- Kept the supplied CSV/JSONL source files unchanged.
- Added `maaproject_train_complete.jsonl` as the 110-row canonical runtime dataset.
- Switched Gemini fallback model names to stable 2.5 Flash tiers rather than relying on an unverified 3.7 model name.
- Demo ticket contact values were neutralized so the public project does not ship with phone-number-like demo PII.

### Important runtime note
The environment could not complete `npm install` within the available execution window, so a real browser build (`npm run build`) and live Gemini request could not be executed here. This is an environment limitation, not a claim that the build passed.

Before deployment, install dependencies and run:
- `npm install`
- `npm run lint`
- `npm run validate:datasets`
- `npm run build`
- `npm start`

For production, set:
- `GEMINI_API_KEY`
- `ADMIN_API_KEY`
- `SESSION_SECRET` (32+ random characters)
- `APP_URL`

Google OAuth is intentionally not faked. A real Google OAuth Client ID and provider configuration are required before a Google button can be truthfully enabled.
