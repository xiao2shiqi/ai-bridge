# ai-bridge

> Maintain one `.ai/` directory. Every AI coding tool stays in sync.

Instead of maintaining separate `.claude/`, `.agents/`, and tool-specific config files, `ai-bridge` gives you a single source of truth and handles the rest.

## The problem

| What you want to manage | Claude Code expects | OpenAI Codex expects |
|---|---|---|
| Project instructions | `CLAUDE.md` | `AGENTS.md` |
| Skills | `.claude/skills/` | `.agents/skills/` |
| MCP servers | `.claude/settings.json` | `.codex/config.toml` |
| Hooks | `.claude/settings.json` | `.codex/config.toml` |

Two tools, two directories, two formats. Change one thing, update two places.

## The solution

```
your-project/
└── .ai/                    ← the only directory you maintain
    ├── instructions.md     → CLAUDE.md + AGENTS.md (symlinked)
    ├── config.yaml         → .claude/settings.json + .codex/config.toml (generated)
    └── skills/             → .claude/skills/ + .agents/skills/ (symlinked)
```

Skills use the [Agent Skills](https://agentskills.io) open standard — already compatible with both tools. Instructions are symlinked so edits are instant. Config files are generated from a single `config.yaml`.

## Install

```bash
npm install -g ai-bridge
```

## Usage

```bash
# In your project directory:

# 1. Initialize .ai/ and create symlinks
ai-bridge init

# 2. Edit your unified config
#    - .ai/instructions.md  →  project rules for all AI tools
#    - .ai/config.yaml      →  MCP servers and hooks
#    - .ai/skills/          →  shared Agent Skills

# 3. After editing config.yaml, sync to tool-specific formats
ai-bridge sync
```

## .ai/config.yaml format

```yaml
mcp_servers:
  filesystem:
    command: npx -y @modelcontextprotocol/server-filesystem /tmp
  github:
    command: npx -y @modelcontextprotocol/server-github
    env:
      GITHUB_TOKEN: your-token

hooks:
  after_tool_use:
    - command: echo "tool used"
      timeout: 5000
```

`ai-bridge sync` translates this into:

- `.claude/settings.json` — Claude Code format
- `.codex/config.toml` — OpenAI Codex format

## What gets symlinked vs generated

| File | Strategy | Why |
|---|---|---|
| `CLAUDE.md` | symlink → `.ai/instructions.md` | Same format, instant sync |
| `AGENTS.md` | symlink → `.ai/instructions.md` | Same format, instant sync |
| `.claude/skills/` | symlink → `.ai/skills/` | Agent Skills standard is shared |
| `.agents/skills/` | symlink → `.ai/skills/` | Agent Skills standard is shared |
| `.claude/settings.json` | generated | JSON vs TOML, different schema |
| `.codex/config.toml` | generated | JSON vs TOML, different schema |

## Windows support

On Windows, symlinks require developer mode or admin privileges. `ai-bridge init` detects this automatically and falls back to file copying. Run `ai-bridge sync` after any change to `.ai/` to keep copies in sync.

```bash
ai-bridge init --no-symlinks  # force copy mode on any platform
```

## Roadmap

- [ ] OpenCode support (`.opencode/`)
- [ ] `ai-bridge watch` — auto-sync on file changes
- [ ] Git hook integration
- [ ] More tools (Cursor, GitHub Copilot, Gemini CLI...)

## Contributing

This project follows the [Agent Skills](https://agentskills.io) open standard. PRs welcome.

## License

MIT
