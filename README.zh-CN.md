# ai-bridge

> 只维护一个 `.ai/` 目录，所有 AI 编程工具自动保持同步。

**[English](README.md) | [中文](README.zh-CN.md)**

同时使用 Claude Code 和 OpenAI Codex 时，你会发现两个工具对配置文件的要求完全不同。`ai-bridge` 以 `.ai/` 目录作为唯一配置来源，自动生成或同步到各工具所需的格式。

## 问题

| 需要管理的内容 | Claude Code | OpenAI Codex |
|---|---|---|
| 项目说明文件 | `CLAUDE.md` | `AGENTS.md` |
| Skills 目录 | `.claude/skills/` | `.agents/skills/` |
| MCP 服务器配置 | `.claude/settings.json` | `.codex/config.toml` |
| Hooks 配置 | `.claude/settings.json` | `.codex/config.toml` |

两套工具、两个目录、两种格式——改一处就要同步两边，非常繁琐。

## 解决方案

```
你的项目/
└── .ai/                    ← 唯一需要维护的目录
    ├── instructions.md     → 软链接到 CLAUDE.md 和 AGENTS.md
    ├── config.yaml         → 生成 .claude/settings.json 和 .codex/config.toml
    └── skills/             → 软链接到 .claude/skills/ 和 .agents/skills/
```

- **Skills**：两个工具都遵循 [Agent Skills](https://agentskills.io) 开放标准，格式完全相同，用软链接共享，零维护。
- **说明文件**：`CLAUDE.md` 和 `AGENTS.md` 软链接到同一个 `.ai/instructions.md`，编辑一次立刻生效。
- **配置文件**：MCP 服务器和 Hooks 格式不同（JSON vs TOML），通过 `ai-bridge sync` 从统一的 `config.yaml` 自动生成。

## 安装

```bash
npm install -g ai-bridge
```

## 使用

```bash
# 在项目目录下：

# 1. 初始化 .ai/ 目录并创建软链接
ai-bridge init

# 2. 编辑统一配置
#    - .ai/instructions.md  →  所有 AI 工具共用的项目说明
#    - .ai/config.yaml      →  MCP 服务器和 Hooks 配置
#    - .ai/skills/          →  共享的 Agent Skills

# 3. 修改 config.yaml 后同步到各工具格式
ai-bridge sync
```

## .ai/config.yaml 格式

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

执行 `ai-bridge sync` 后自动生成：

- `.claude/settings.json` — Claude Code 格式
- `.codex/config.toml` — OpenAI Codex 格式

## 软链接 vs 生成文件

| 文件 | 策略 | 原因 |
|---|---|---|
| `CLAUDE.md` | 软链接 → `.ai/instructions.md` | 格式相同，修改立即生效 |
| `AGENTS.md` | 软链接 → `.ai/instructions.md` | 格式相同，修改立即生效 |
| `.claude/skills/` | 软链接 → `.ai/skills/` | Agent Skills 标准共享 |
| `.agents/skills/` | 软链接 → `.ai/skills/` | Agent Skills 标准共享 |
| `.claude/settings.json` | 生成 | JSON vs TOML，格式不同 |
| `.codex/config.toml` | 生成 | JSON vs TOML，格式不同 |

## Windows 支持

Windows 默认需要开发者模式或管理员权限才能创建软链接。`ai-bridge init` 会自动检测并回退到文件复制模式。每次修改 `.ai/` 后运行 `ai-bridge sync` 保持同步。

```bash
ai-bridge init --no-symlinks  # 强制使用复制模式
```

## 路线图

- [ ] 支持 OpenCode（`.opencode/`）
- [ ] `ai-bridge watch` — 监听文件变更自动同步
- [ ] Git Hook 集成
- [ ] 支持更多工具（Cursor、GitHub Copilot、Gemini CLI 等）

## 贡献

本项目遵循 [Agent Skills](https://agentskills.io) 开放标准，欢迎提交 PR。

## 许可证

MIT
