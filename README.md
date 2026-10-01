# DSH Taste Skill

A DeepSeek Harness plugin that adds context-aware frontend design guidance based on [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill). It helps DSH produce more deliberate, audience-aware interfaces and avoid generic template aesthetics.

The DSH bundle injects a compact design policy into the system prompt. The upstream full skill document is included at skills/taste-skill/SKILL.md for reference. Guidance is scoped to landing pages, portfolios, and editorial/brand websites; it does not impose a visual theme on dashboards or existing product UI.

## Install

Install into the web profile, then restart DSH once for the bundle to load:

```bash
dsh plugin --profile web add dsh-taste-skill
```

To install into the active profile instead:

```bash
dsh plugin add dsh-taste-skill
```

## Source

Plugin repository: https://github.com/YMRwithNoworry/dsh-taste-skill

Upstream project: https://github.com/Leonxlnx/taste-skill

The included upstream skill is distributed under MIT; see LICENSE. Adaptation and DSH bundle packaging by the dsh-taste-skill contributors.
