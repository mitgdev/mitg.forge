
<p align="center">
  <img src="./images/wallpaper.gif" alt="MiForge Example" />
</p>

<div align="center">
  <a href="https://github.com/mitgdev/mitg.forge/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a href="https://discord.gg/mitg"><img alt="Discord" src="https://img.shields.io/discord/1308861105145385081?label=Discord"></a>
  <br />
  <a href="https://sonarcloud.io/summary/new_code?id=mitgdev_mitg.forge"><img src="https://sonarcloud.io/api/project_badges/measure?project=mitgdev_mitg.forge&metric=bugs" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=mitgdev_mitg.forge"><img src="https://sonarcloud.io/api/project_badges/measure?project=mitgdev_mitg.forge&metric=code_smells" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=mitgdev_mitg.forge"><img src="https://sonarcloud.io/api/project_badges/measure?project=mitgdev_mitg.forge&metric=duplicated_lines_density" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=mitgdev_mitg.forge"><img src="https://sonarcloud.io/api/project_badges/measure?project=mitgdev_mitg.forge&metric=security_rating" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=mitgdev_mitg.forge"><img src="https://sonarcloud.io/api/project_badges/measure?project=mitgdev_mitg.forge&metric=sqale_rating" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=mitgdev_mitg.forge"><img src="https://sonarcloud.io/api/project_badges/measure?project=mitgdev_mitg.forge&metric=vulnerabilities" /></a>
  <hr />
</div>

MiForge is a portal/AAC inspired by **tibia.com**, focused on multi-world, performance, and Developer Experience (DX) for **Crystal** and **Canary** based servers.

🔗 **Preview:** <https://miforge.mitg.dev>  

## Project Status

| Module   | Status    |
|----------|-----------|
| AAC/API  | 🟢 Active |
| Web      | 🟢 Active |
| Client    | ⚪ Planned |

## Project Progress

| TODO | Status | PR |
|---|---|---|
| AAC (API) | ![](https://us-central1-progress-markdown.cloudfunctions.net/progress/20) | None
| AAC (Web) | ![](https://us-central1-progress-markdown.cloudfunctions.net/progress/20) | None
| Client  | ![](https://us-central1-progress-markdown.cloudfunctions.net/progress/0) | None

---

## Index

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [How to run in development](#how-to-run-in-development)
- [Contributing](#contributing)
- [License](#license)
- [Legal notice](#legal-notice)

---

## Overview

MiForge's goal is to be a **complete and modern AAC** for Tibia servers:

- Panel inspired by the original tibia.com experience.
- Support for **multi-world** and multi-server.
- Focused on **full-stack TypeScript**, performance, and DirectX.
- Designed to be **open and extensible** for the OT community.

---

## Tutorials & Documentation

- [How to release a new version of outfits](./tutorials/release-outfits.md)

---

## Features

### Already Implementing / In Progress

- 🧑‍💻 Account Management (login, account creation, lost account).
- 🔐 Infrastructure for secure authentication (with 2FA/TOTP support on the roadmap).
- 🎨 Themed frontend with Tibia-style layout.
- 🧱 Monorepo with clear separation between API, Web, and shared packages.

### Planned

- 📊 Rankings (XP, skills, frags, etc.).
- 📰 News/Announcements module.
- 👥 Guild/Community system.
- 🔑 Advanced integration with Crystal/Canary (player status, worlds, etc.).
- 🚀 Dedicated Launcher & Client within the same MiForge ecosystem.

*(The list above may change — see the [Roadmap](#project-status) and issues for the most recent status.)*

---

## Architecture

MiForge is a **TypeScript-first monorepo** organized into:

- `apps/api` – MiForge API
  - Bun + Hono
  - ORPC for typed contracts between front and back end
  - Prisma as ORM
  - `tsyringe` for dependency injection (services, repositories, clients, etc.)
- `apps/web` – Portal frontend
  - React + Vite
  - Tailwind CSS
  - TanStack Router / TanStack Query
  - Custom UI in the style of tibia.com
- `packages/*` – Shared packages
  - Zod schemas, shared types, SDK/API client, reusable components, etc.
- `docker/` – Supporting files for deploying the database/other services under development
- `docs/` – Documentation materials and assets (including screenshots)

Supporting tools:

- **PNPM** for managing dependencies.
- **Turborepo** for orchestrating builds, lint, tests, etc.
- **Husky + lint-staged + Biome** for code standardization and commit hooks.
- Integration with **Sonar** for static analysis.

---

## Screenshots

Example of the login/Account Management screen:

![MiForge Example](./images/example_1.png)

---

## How to run in development

### Prerequisites

- Node.js / Bun installed
- PNPM installed (`corepack enable`)
- Docker + Docker Compose installed

### Step-by-step

```bash
# 1. Clone the repository
git clone https://github.com/mitgdev/mitg.forge.git
cd mitg.forge

# 2. Copy the environment file and adjust the variables
cp .env.example .env
# edit .env with your settings (DB, Redis, etc.)

# 3. Start the dependencies (database, etc.)
docker compose up -d
# or
# docker-compose up -d

# 4. Install the monorepo dependencies
pnpm install
```

---

## Contributing

Contributions are very welcome! 💜

1. Fork the repository.
2. Create a branch for your feature/fix:

```
git checkout -b my-feature
```

3. Lint, build, and test your code locally:
4. Open a Pull Request describing your changes.

Before contributing, please read:

- The contribution guide at [CONTRIBUTING.md](../CONTRIBUTING.md).
- The code of conduct at [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md).
- Security at [SECURITY.md](../SECURITY.md).

---

## License

This project is distributed under the license described in [LICENSE](../LICENSE).

---

## Legal notice

Tibia is a registered trademark and property of CipSoft GmbH.
MiForge is a community project and is not affiliated with, endorsed by, or supported by CipSoft.
