# Angular Starter 2026

Production-ready Angular 21 boilerplate with 2026 best practices baked in. Zoneless, signal-first, fully linted, auto-formatted, and CI-ready out of the box.

---

## Stack & Architectural Decisions

Every tool here was chosen deliberately. This section explains the *why*, not just the *what*.

### Angular 21

The current active LTS release. Angular 21 ships stable Zoneless change detection and experimental Signal Forms — both of which this starter adopts. Using the latest active version means access to the best performance primitives Angular has ever shipped, with long-term support and a clear upgrade path.

### Zoneless Change Detection

`zone.js` has been removed entirely. Change detection is driven by Signals via `provideZonelessChangeDetection()` in `app.config.ts`.

**Why it matters:**
- ~33KB off the initial bundle (zone.js patch file eliminated)
- 30–40% faster rendering — no more dirty-checking every async operation
- Clean, readable stack traces — no zone frames polluting the call stack
- Native `async/await` and `Promise` work as expected without patching

### `ChangeDetectionStrategy.OnPush` by Default

Every component in this starter uses `OnPush`. The ESLint rule `@angular-eslint/prefer-on-push-component-change-detection` is set to `error`, so forgetting it breaks the lint check.

With Zoneless, `OnPush` is not just a performance hint — it is the correct default. The component tree only updates when a Signal emits a new value or `markForCheck()` is called explicitly. No surprise re-renders.

### Signals

Angular's native fine-grained reactivity primitive. Used for all local component state instead of `BehaviorSubject` / `Observable` chains.

**Why not RxJS for local state?** RxJS remains the right tool for async streams, HTTP, and complex event composition. But for `count`, `isOpen`, `selectedItem` — a `signal()` is simpler, more readable, and integrates directly with the template without `async` pipe overhead.

### Tailwind CSS v4

Utility-first CSS configured via `@tailwindcss/postcss` (PostCSS pipeline, compatible with `@angular/build:application`).

**Why v4 specifically:**
- Zero dead CSS in production — only classes present in source files are emitted
- No naming conflicts with Angular's encapsulated component styles
- v4 drops the config file requirement: content scanning is automatic, `@import "tailwindcss"` is the entire setup
- The `src/tailwind.css` entry file keeps Tailwind out of the Sass pipeline entirely, avoiding deprecation warnings

### Vitest

The default test runner for Angular 21 projects — Karma has been removed from the Angular CLI. Vitest integrates natively with the esbuild/Vite pipeline used by `@angular/build:application`.

**vs Jest:** Vitest reuses the same Vite transform already running for the build. No separate Babel config, no module aliasing duplication. On Vite-based projects it runs 3–8x faster than Jest cold-start. In CI, `CI=true` is auto-detected and Vitest exits after a single run — no flags required.

### ESLint Flat Config

`eslint.config.js` uses the modern flat config format (ESLint ≥ 9). The legacy `.eslintrc` format is deprecated and will be removed.

Custom rules enforced beyond the angular-eslint recommended set:

| Rule | Level | Reason |
|---|---|---|
| `@typescript-eslint/no-explicit-any` | warn | Signals a type coverage gap worth reviewing |
| `@angular-eslint/prefer-on-push-component-change-detection` | error | Enforces the architectural decision at the tooling level |

### Prettier

Auto-formatting on save and on commit. No configuration debates. The default Prettier ruleset is the standard — deviating from it requires a conscious decision, not a habit.

### Husky + lint-staged

Git hooks managed by Husky run lint-staged before every commit. Only staged files are processed — not the entire codebase — so the hook completes in under a second regardless of project size.

**What runs on commit:**
- `*.ts` — `eslint --fix` then `prettier --write`
- `*.html` — `prettier --write`
- `*.scss` — `prettier --write`

Non-conforming code cannot be committed. The hook is the last line of defense before CI.

### GitHub Actions

CI pipeline defined in `.github/workflows/ci.yml`. Triggers on every push and pull request to `main`.

Pipeline steps: checkout → Node 22 setup (with `npm` cache) → `npm ci` → lint → production build → tests.

Fast feedback: a broken lint or failing test surfaces before the PR is reviewed, not after.

---

## Getting Started

```bash
# Install dependencies
npm ci

# Start dev server (http://localhost:4200)
npm start

# Run tests (watch mode)
npm test

# Run tests (single pass, CI mode)
npx ng test --watch=false

# Production build
npm run build

# Lint
npm run lint
```

---

## Project Structure

```
angular-starter/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI pipeline
├── .husky/
│   └── pre-commit          # Runs lint-staged before every commit
├── src/
│   ├── app/
│   │   ├── app.ts          # Root component (OnPush, Signals)
│   │   ├── app.config.ts   # Bootstrap config (Zoneless, Router)
│   │   ├── app.routes.ts   # Route definitions
│   │   └── app.spec.ts     # Root component tests
│   ├── tailwind.css        # Tailwind entry point (@import "tailwindcss")
│   ├── styles.scss         # Global SCSS styles
│   └── main.ts             # Application bootstrap
├── eslint.config.js        # ESLint flat config
├── postcss.config.mjs      # PostCSS config (Tailwind v4)
├── angular.json            # Angular workspace config
└── tsconfig.json           # TypeScript config (strict mode)
```

New features go in `src/app/` as standalone components. There are no NgModules — Angular 17+ standalone is the only pattern used in this project.
