# Web Icfes Master - Master the ICFES from Scratch 📝

This document is in English. [Versión en español](README.md)

An interactive platform to practice questions and learn topics from the ICFES state exam (Saber 11) in Colombia. Built
with **feature-based** architecture using Next.js 15, React 19, Tailwind CSS 4, and Supabase.

Static assets (mascot, brand screenshots) live in **`src/assets/`** and are imported from `@/assets` (App Router + `next/image`). The favicon is at **`src/app/favicon.ico`** and the Open Graph image at **`src/app/opengraph-image.png`** (Next.js App Router file convention).

> [!NOTE] The goal was to reach many more countries beyond Colombia, but each country handles education differently:
> questions, topics, and subjects change. There are even countries where the exam is not mandatory or does not exist.
>
> [!IMPORTANT] Free/Pro/Premium plan billing is **disabled for 2026** (`BILLING_ENABLED=false`). See
> [decisions/billing-no-2026.md](docs/en/decisions/billing-no-2026.md).

![Hero section of the ICFES platform - Master the ICFES from Scratch](src/assets/images/screenshot.png)

![ICFES Master Open Graph image for social media previews](src/app/opengraph-image.png)

---

## Table of Contents

- [Web Icfes Master - Master the ICFES from Scratch 📝](#web-icfes-master---master-the-icfes-from-scratch-)
  - [Table of Contents](#table-of-contents)
  - [Main Features](#main-features)
  - [Technical Documentation](#technical-documentation)
  - [Steps to Contribute](#steps-to-contribute)
    - [Contributors](#contributors)
  - [Contact](#contact)

---

## Main Features

For Critical Reading, Social Studies, English, Mathematics, and Natural Sciences:

- Concepts by subject area, interactive lessons, and questions tied to each lesson.
- Practice with questions grouped by subject.
- ICFES-style mock exams with time limits and full-format sessions.

---

## Technical Documentation

Folder: [`docs/en/`](docs/en/) — Index: [overview.md](docs/en/overview/overview.md)

| Document                                                                | Description                     |
| ----------------------------------------------------------------------- | ------------------------------- |
| [installation.md](docs/en/setup/installation.md)                        | Local setup                     |
| [configuration.md](docs/en/setup/configuration.md)                      | Environment variables and modes |
| [technologies.md](docs/en/setup/technologies.md)                        | Full stack                      |
| [routes.md](docs/en/setup/routes.md)                                    | Application URLs                |
| [architecture.md](docs/en/frontend/architecture.md)                     | Feature-based rules             |
| [project-structure.md](docs/en/overview/project-structure.md)           | Folder tree                     |
| [components-guide.md](docs/en/frontend/components-guide.md)             | Components and hooks            |
| [services-api.md](docs/en/backend/services-api.md)                      | Persistence and Supabase        |
| [learning-structure-guide.md](docs/en/data/learning-structure-guide.md) | Roadmap (`learning_content`)    |
| [cheatsheet.md](docs/en/setup/cheatsheet.md)                            | Quick reference                 |

Spanish version: [`docs/es/`](docs/es/)

---

## Steps to Contribute

1. Fork the repository.
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

### Contributors

Thanks to everyone who has contributed to this project!

<p align="center">
  <a href="https://github.com/FraVelz/WEB-ICFES-Master/graphs/contributors">
    <img
      src="https://contrib.rocks/image?repo=FraVelz/WEB-ICFES-Master&max=500&columns=20"
      alt="WEB-ICFES-Master contributors"
    />
  </a>
</p>

---

## Contact

For suggestions or to report bugs, open an issue on the GitHub repository or internally through the platform.

---

**Development:** Fravelz

**License:** Apache License 2.0

---

_AI-generated file. Last updated: Wednesday, May 27, 2026._
