---
title: Overview
---

TEN Agent is the reference application for the TEN ecosystem. It combines real-time RTC transport, multimodal perception, and LLM-assisted reasoning so an agent can see, hear, and respond without noticeable latency. The project ships opinionated defaults (OpenAI Realtime, Gemini 2.0 Live, Deepgram ASR, ElevenLabs TTS, and Agora RTC), but every stage is swappable through TEN’s extension system and compatible with workflow tools such as Dify or Coze.

## Quick Links

- [TEN Agent repository](https://github.com/TEN-framework/TEN-Agent)
- [TEN Framework](https://github.com/TEN-framework/ten-framework)
- [Getting Started](./getting_started)
- [Project structure](./project_structure)

## High-level Architecture

At a glance TEN Agent is made up of three collaborating layers:

1. **TEN runtime** — The `agents/` directory contains the runnable graphs, `property.json`, and the `ten_packages` directory. Each package is a self-contained extension (Python, Go, or C++) that plugs sensors, LLMs, or business logic into the graph.
2. **Control plane services** — A lightweight Go web server (`server/`) starts and stops agents, exposes REST endpoints, and proxies metadata to the UI. Supporting scripts and tasks live under `scripts/`.
3. **User interfaces** — The React playground (`playground/`) and the production demo (`demo/`) talk to the server to configure graphs, supply credentials, and showcase end-to-end scenarios.

The diagram below is covered in more detail in [Project structure](./project_structure), but the overview above reflects the latest repo layout.

## Docker Services

Running `docker compose up -d` provisions a complete development sand-box:

- `ten_agent_dev` (container shell, port 49483) bundles the TEN runtime, TMAN Designer, and build tooling. Use it to run `task use`, `task run`, and other CLI tasks.
- `ten_agent_playground` (port 3000) serves the UI for configuring graphs, swapping extensions, and testing agents in a browser.
- `ten_agent_demo` (port 3002) is an optional showcase build that mirrors a production deployment for demos or benchmarking.

Each container is hot-reload friendly: file changes mounted into `agents/` or `playground/` are reflected without rebuilding images.

## Key Directories

| Path | Purpose |
| ---- | ------- |
| `agents/` | Entry point for agent graphs and binaries. `agents/examples/` holds turnkey templates (voice assistant, realtime avatar, interrupt detector, etc.). |
| `agents/ten_packages/extension/` | Custom extensions that implement orchestration logic, LLM adapters, or tool integrations. Ship your own package here and wire it through `property.json`. |
| `agents/ten_packages/system/` | Shared system extensions distributed with TEN (RTC bridges, messaging glue, telemetry, and more). |
| `server/` | Go web server that exposes `/start`, `/stop`, and `/ping` endpoints to manage agent lifecycles. |
| `playground/` | Next.js app used for local experimentation. It lets you edit graph properties, inspect module bindings, and trigger runs directly from the browser. |
| `demo/` | Production-style sample front end. Useful for validating a workflow end to end or for stakeholder demos. |
| `scripts/` | Helper scripts and task definitions (the `task` CLI wraps these). |

## Developer Workflow

1. **Bootstrap containers** — Follow the [Getting Started](./getting_started) guide to clone the repo, create `.env`, and run `docker compose up -d`.
2. **Enter `ten_agent_dev`** — `docker exec -it ten_agent_dev bash`, then `task use` to build an example graph.
3. **Launch services** — `task run` starts the Go server. Visit `http://localhost:49483` to open TMAN Designer or `http://localhost:3000` to use the playground UI.
4. **Iterate** — Modify extensions in `ten_packages`, tweak graph nodes in TMAN Designer, and redeploy via the playground or CLI.
5. **Demo or ship** — Use the `demo/` app or the `/start` API to integrate the agent into your own client applications.

## Why this structure?

- **Isolation of concerns** keeps runtime extensions (`ten_packages`) versioned alongside graphs while front-end clients evolve independently.
- **Hot-swappable extensions** mean you can replace any LLM, ASR, or TTS service by editing `property.json` and, if needed, dropping a new package into `ten_packages/extension`.
- **Consistent tooling** (`task` scripts, Docker services, TMAN Designer) streamlines onboarding across teams and ensures parity between development, testing, and demos.

With this layout you can experiment rapidly, share reproducible demos, and progress toward production without re-architecting your agent each time requirements change.
