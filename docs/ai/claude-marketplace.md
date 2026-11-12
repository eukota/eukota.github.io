<!-- DRAFT: first pass written by Claude from project notes. Rewrite in your own voice before publishing. -->
# Claude Marketplace

A personal marketplace of tools for working with Claude, bundled as installable plugins. The source is on [GitHub](https://github.com/eukota/claude-marketplace). Add the marketplace with `/plugin marketplace add eukota/claude-marketplace`, then install any plugin with `/plugin install <plugin-name>@eukota-claude-marketplace`.

## plugin-builder

Tools for building Claude marketplace plugins: choosing the right kind of building block for what you want to make, checking that a name is available, smoke-testing hooks, scaffolding the structure, and following the conventions. [Source](https://github.com/eukota/claude-marketplace/tree/main/plugins/plugin-builder)

## context-setup

A personal project context system for engineers who work with AI assistants. It sets up a structured folder of Markdown and YAML so your assistant remembers what you are working on across sessions and machines, without you repeating yourself. It also maps each project's workspace folders into per-project permissions. [Source](https://github.com/eukota/claude-marketplace/tree/main/plugins/context-setup)

## meldwerkes

A multi-agent system that builds a personalized model of how you make decisions. It learns passively from your normal conversation: it asks, grounds its answer in what it remembers, acts, and takes your corrections. Periodically it distills those decisions into principles, and with more than one "brain" it lets them vote and escalates to you when they disagree. [Source](https://github.com/eukota/claude-marketplace/tree/main/plugins/meldwerkes)

## plan-usage

Tracks your Claude account's rate-limit usage over the 5-hour and 7-day windows from the status line, and reports whether your plan is actually the thing limiting your work. A snapshot can't tell you whether to pay for a higher tier, and the history can. [Source](https://github.com/eukota/claude-marketplace/tree/main/plugins/plan-usage)

## local-dev-standards

Always-on rules for local development: use git worktrees to isolate work, run package installs inside containers, give every project a Makefile with start and stop targets, and use hot reload wherever the stack supports it. [Source](https://github.com/eukota/claude-marketplace/tree/main/plugins/local-dev-standards)

## interview-skills

Short skills for candidates in AI-assisted technical interviews, one for each stage: clarify, plan, direct, review, verify, build integration tests with a dashboard, and narrate. A configure skill sets it up first, asking about your time, level, stack and tools and saving your answers so the other skills adjust to them. Each one leaves a small readable artifact the interviewer can see, and each makes the candidate do the thinking instead of handing it to the AI. [Source](https://github.com/eukota/claude-marketplace/tree/main/plugins/interview-skills)
