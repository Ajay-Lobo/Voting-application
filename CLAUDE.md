# Project instructions

## Git workflow
For every fix or new feature:
1. Create a new branch from `develop` (e.g. `fix/<name>`, `feat/<name>`, `chore/<name>`).
2. Make the changes and commit them on that branch.
3. Push the branch to `origin`.
4. Merge the branch into `develop` (`git merge --no-ff`) and push `develop` to `origin`.

Never commit directly to `develop` or `main`. Never commit `.env` or any real credentials.

## Run locally
- Frontend (repo root): `npm install`, then `npm run dev`.
- API (`server/`): `npm install`, then `npm run dev`. Needs a `.env` with `JWT_SECRET` and the MongoDB connection settings.
