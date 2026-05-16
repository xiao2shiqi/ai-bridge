# ai-bridge

> Maintain one `.ai/` directory. Every AI coding tool stays in sync.

**[English](#the-problem) | [中文介绍](#中文介绍)**

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

---

## 中文介绍

> 只维护一个 `.ai/` 目录，所有 AI 编程工具自动保持同步。

同时使用 Claude Code 和 OpenAI Codex 时，你会发现两个工具对配置文件的要求完全不同：

| 需要管理的内容 | Claude Code | OpenAI Codex |
|---|---|---|
| 项目说明文件 | `CLAUDE.md` | `AGENTS.md` |
| Skills 目录 | `.claude/skills/` | `.agents/skills/` |
| MCP 服务器配置 | `.claude/settings.json` | `.codex/config.toml` |
| Hooks 配置 | `.claude/settings.json` | `.codex/config.toml` |

两套工具、两个目录、两种格式——改一处就要同步两边，非常繁琐。

`ai-bridge` 的解决思路：用一个 `.ai/` 目录作为唯一的配置来源，由工具负责生成或同步到各 AI 工具所需的格式。

### 工作原理

```
你的项目/
└── .ai/                    ← 唯一需要维护的目录
    ├── instructions.md     → 软链接到 CLAUDE.md 和 AGENTS.md
    ├── config.yaml         → 生成 .claude/settings.json 和 .codex/config.toml
    └── skills/             → 软链接到 .claude/skills/ 和 .agents/skills/
```

- **Skills**：两个工具都遵循 [Agent Skills](https://agentskills.io) 开放标准，格式完全相同，用软链接即可共享，零维护。
- **说明文件**：`CLAUDE.md` 和 `AGENTS.md` 通过软链接指向同一个 `.ai/instructions.md`，编辑一次立刻生效。
- **配置文件**：MCP 服务器和 Hooks 的格式不同（JSON vs TOML），通过 `ai-bridge sync` 从统一的 `config.yaml` 自动生成。

### 快速开始

```bash
# 安装
npm install -g ai-bridge

# 在项目目录下初始化
ai-bridge init

# 编辑 .ai/instructions.md 和 .ai/config.yaml 后同步配置
ai-bridge sync
```

### 路线图

- [ ] 支持 OpenCode
- [ ] `ai-bridge watch` 监听文件变更自动同步
- [ ] Git Hook 集成
- [ ] 支持更多工具（Cursor、GitHub Copilot、Gemini CLI 等）
