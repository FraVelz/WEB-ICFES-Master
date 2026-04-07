# Web Icfes Master - Master the ICFES from Scratch 📝

[Spanish version](README.md)

An interactive platform to practice questions and learn topics from the ICFES state exam (Saber 11) in Colombia. Built with **Feature-Based** and **Atomic Design** architecture using Next.js 15, React 19, Tailwind CSS 3, and Supabase.

> [!NOTE]
> The goal was to cover many more countries besides Colombia, but each country handles education differently—questions, topics, and subjects vary. In some countries, the exam is not mandatory or does not exist.

![Hero section of the ICFES platform - Master the ICFES from Scratch](public/images/screenshot.png)

---

## Table of Contents

- [Web Icfes Master - Master the ICFES from Scratch 📝](#web-icfes-master---master-the-icfes-from-scratch-)
  - [Table of Contents](#table-of-contents)
  - [Main Features](#main-features)
  - [Question Content](#question-content)
  - [Achievement System](#achievement-system)
    - [Achievement Categories (40+ total)](#achievement-categories-40-total)
    - [Levels and Experience](#levels-and-experience)
  - [Deployment](#deployment)
  - [Documentation](#documentation)
    - [Overview](#overview)
    - [Setup](#setup)
    - [Frontend](#frontend)
    - [Backend and Data](#backend-and-data)
    - [Integrations](#integrations)
  - [Contributing](#contributing)
  - [Contact](#contact)

---

## Main Features

> [!WARNING]
> Mostly implemented. However, some features are not fully implemented.

- **3 Learning Levels**:
  - **Easy Level**: Learn basics with structured materials and basic exercises
  - **Intermediate Level**: Practice individual exams by subject
  - **Advanced Level**: Full ICFES mock exam with 200 questions in 3 hours

- **Practice by Area**: Mathematics, Language, Natural Sciences, Social Sciences, and English
- **Full Mock Exam**: Solve all questions with configurable timer
- **Advanced Study Material**: Access to educational resources organized by topic
- **Progress Tracking**: View your statistics and areas for improvement
- **Daily Challenges and Leaderboard**: Compete and maintain study streaks
- **Authentication**: Sign in with email/password and Google (Supabase Auth)
- **Gamification System**: 40+ unlockable achievements by category (First Steps, Streaks, Academic Achievements, Excellence, Plans)
- **Subscription Plans**: Free, Pro, Premium, and Annual with progressive benefits
- **Grading System**: Immediate feedback with detailed explanations
- **Responsive Interface**: Works perfectly on mobile, tablet, and desktop
- **Multimedia Content**: Supports images, tables, formulas, charts, and more

---

## Question Content

> [!WARNING]
> Not fully implemented.

- **Mathematics**: Algebra, Geometry, Calculus, Statistics
- **Language**: Grammar, Vocabulary, Comprehension, Literature
- **Natural Sciences**: Biology, Physics, Chemistry, Ecology
- **Social Sciences**: History, Geography, Economics, Politics
- **English**: Vocabulary, Grammar, Reading Comprehension

Total: 40+ questions with advanced content (images, tables, formulas, charts)

---

## Achievement System

> [!WARNING]
> Logic not yet implemented.

### Achievement Categories (40+ total)

1. **First Steps** (4 achievements)
   - First Step, Apprentice, Perfectionist Beginner, Initial Streak

2. **Streaks** (4 achievements)
   - Week on Fire, Monthly Champion, Streak Legend, Dedicated for a Year

3. **Academic Achievements** (8 achievements)
   - Dedicated Student, Test Master, Knowledge Sentinel
   - Precision, Flawless, Virtuoso

4. **Excellence** (4 achievements)
   - Excellence, Integral Master, Speed Demon, Consistency Champion

5. **Plans and Subscriptions** (16 achievements)
   - Free Plan: Free User, Explorer
   - Pro Plan: Pro User, Pro Power, Advanced Pro
   - Premium Plan: Premium User, Premium Elite, Premium Mastery, Premium Sentinel
   - Annual Plan: Annual Subscriber, Annual Commitment, Annual Legend, Lifelong Learner

### Levels and Experience

- Progressive level system based on XP
- Unlockable based on plans and user activity
- Progress visualization toward the next level

---

## Deployment

The application is configured for deployment on CubePath, with the appropriate server configuration. Nginx is used as an intermediary (reverse proxy) and a URL is obtained via DuckDNS. Server deployment is managed using npm and PM2.

---

## Documentation

Folder: `docs/en/`

### Overview

- [**overview/README.md**](docs/en/overview/README.md) — Documentation index
- [**overview/executive-summary.md**](docs/en/overview/executive-summary.md) — Executive summary for managers and new team members
- [**overview/project-structure.md**](docs/en/overview/project-structure.md) — Project folder structure and architecture

### Setup

- [**setup/installation.md**](docs/en/setup/installation.md) — Step-by-step local environment installation
- [**setup/configuration.md**](docs/en/setup/configuration.md) — Environment variables and configuration files
- [**setup/technologies.md**](docs/en/setup/technologies.md) — Tech stack (Next.js, React, Tailwind, etc.)
- [**setup/routes.md**](docs/en/setup/routes.md) — Application URLs and routes
- [**setup/scripts.md**](docs/en/setup/scripts.md) — package.json commands (dev, build, lint, etc.)
- [**setup/cheatsheet.md**](docs/en/setup/cheatsheet.md) — Quick commands and frequently used snippets

### Frontend

- [**frontend/architecture.md**](docs/en/frontend/architecture.md) — Feature-Based architecture with Next.js
- [**frontend/components-guide.md**](docs/en/frontend/components-guide.md) — Hooks usage and component creation
- [**frontend/styles-guide.md**](docs/en/frontend/styles-guide.md) — Design system and Tailwind CSS

### Backend and Data

- **Supabase** — Database and authentication
- [**backend/services-api.md**](docs/en/backend/services-api.md) — Services API, Supabase architecture, and data layer
- [**data/learning-structure-guide.md**](docs/en/data/learning-structure-guide.md) — Learning module data structure (`learning_content` table)

### Integrations

- [**integrations/payments.md**](docs/en/integrations/payments.md) — Payment integration (PricingPlans, PaymentModal, Supabase)

---

## Contributing

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Contact

For suggestions or bug reports, create an issue in the GitHub repository.

---

**Development:** Fravelz

**License:** Apache License 2.0
