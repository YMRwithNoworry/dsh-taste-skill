# DSH Taste Skill

A DeepSeek Harness plugin that adds context-aware frontend design guidance based on [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill). It helps DSH produce more deliberate, audience-aware interfaces and avoid generic template aesthetics.

The DSH bundle injects a compact design policy into the system prompt. The unmodified upstream full skill document is registered with DSH as `design-taste-frontend` and loads on demand through the skill tool. A user/project skill with the same name takes precedence. The skills service is optional; profiles without it still receive the compact policy. Guidance is scoped to landing pages, portfolios, and editorial/brand websites; it does not impose a visual theme on dashboards or existing product UI.

## Install

Install into the web profile, then restart DSH once for the bundle to load:

```bash
dsh plugin --profile web add dsh-taste-skill
```

For another profile, replace `web` with its name. The profile option is required.

Version 1.0.2 fixes the missing runtime entry in 1.0.0/1.0.1. Upgrade explicitly:

```bash
dsh plugin --profile web add dsh-taste-skill@1.0.2
```

## Development

```bash
npm ci
npm run build
npm test
npm pack --dry-run
```

The Cordis entry exposes `enabled` (default true), `order` (default 420), and `text` (compact policy override). Set `enabled: false` to disable both the policy and skill provider. This package performs no network requests at runtime and adds no tools or credentials.

## Source

Plugin repository: https://github.com/YMRwithNoworry/dsh-taste-skill

Upstream project: https://github.com/Leonxlnx/taste-skill

The included upstream skill is distributed under MIT; see LICENSE. Adaptation and DSH bundle packaging by the dsh-taste-skill contributors.
