import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { ensureDir, safeCreateSymlinkOrCopy, isWindows } from '../utils/fs.js'

const AI_DIR = '.ai'
const INSTRUCTIONS_FILE = 'instructions.md'
const CONFIG_FILE = 'config.yaml'
const SKILLS_DIR = 'skills'

const DEFAULT_INSTRUCTIONS = `# AI Instructions

This file is the single source of truth for AI coding assistant instructions.
It is shared across Claude Code (CLAUDE.md) and OpenAI Codex (AGENTS.md).

## Project Overview

Describe your project here.

## Coding Guidelines

- Add your coding conventions here
`

const DEFAULT_CONFIG = `# ai-bridge unified config
# Run \`ai-bridge sync\` after editing to apply changes to all tools.

mcp_servers: {}
  # Example:
  # filesystem:
  #   command: npx -y @modelcontextprotocol/server-filesystem /tmp

hooks: {}
  # Example:
  # after_tool_use:
  #   - command: echo "tool used"
  #     timeout: 5000
`

type InitOptions = {
  symlinks: boolean
}

export async function initCommand(options: InitOptions): Promise<void> {
  const cwd = process.cwd()
  const useCopy = !options.symlinks || isWindows()

  const aiDir = path.join(cwd, AI_DIR)
  const skillsDir = path.join(aiDir, SKILLS_DIR)
  const instructionsFile = path.join(aiDir, INSTRUCTIONS_FILE)
  const configFile = path.join(aiDir, CONFIG_FILE)

  console.log(chalk.bold('\nai-bridge init\n'))

  // 1. Create .ai/ structure
  ensureDir(aiDir)
  ensureDir(skillsDir)

  if (!fs.existsSync(instructionsFile)) {
    fs.writeFileSync(instructionsFile, DEFAULT_INSTRUCTIONS)
    console.log(chalk.green('  created') + '  .ai/instructions.md')
  } else {
    console.log(chalk.gray('  exists ') + '  .ai/instructions.md')
  }

  if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, DEFAULT_CONFIG)
    console.log(chalk.green('  created') + '  .ai/config.yaml')
  } else {
    console.log(chalk.gray('  exists ') + '  .ai/config.yaml')
  }

  console.log(chalk.green('  created') + '  .ai/skills/')

  // 2. Claude Code: .claude/
  const claudeDir = path.join(cwd, '.claude')
  ensureDir(claudeDir)

  // .claude/skills -> .ai/skills
  safeCreateSymlinkOrCopy(skillsDir, path.join(claudeDir, 'skills'), useCopy)
  console.log(chalk.green('  linked ') + '  .claude/skills  →  .ai/skills')

  // CLAUDE.md -> .ai/instructions.md
  safeCreateSymlinkOrCopy(instructionsFile, path.join(cwd, 'CLAUDE.md'), useCopy)
  console.log(chalk.green('  linked ') + '  CLAUDE.md       →  .ai/instructions.md')

  // 3. Codex: .agents/
  const agentsDir = path.join(cwd, '.agents')
  ensureDir(agentsDir)

  const agentsSkillsDir = path.join(agentsDir, 'skills')
  safeCreateSymlinkOrCopy(skillsDir, agentsSkillsDir, useCopy)
  console.log(chalk.green('  linked ') + '  .agents/skills  →  .ai/skills')

  // AGENTS.md -> .ai/instructions.md
  safeCreateSymlinkOrCopy(instructionsFile, path.join(cwd, 'AGENTS.md'), useCopy)
  console.log(chalk.green('  linked ') + '  AGENTS.md       →  .ai/instructions.md')

  // 4. Add .ai/ to .gitignore note, and remind about sync
  console.log(chalk.bold('\nNext steps:\n'))
  console.log('  1. Edit ' + chalk.cyan('.ai/instructions.md') + ' — your project rules for all AI tools')
  console.log('  2. Edit ' + chalk.cyan('.ai/config.yaml') + ' — add MCP servers and hooks')
  console.log('  3. Run   ' + chalk.cyan('ai-bridge sync') + ' — generate tool-specific config files')
  console.log('  4. Add   ' + chalk.cyan('.ai/skills/') + ' to git for shared skills\n')

  if (useCopy && isWindows()) {
    console.log(chalk.yellow('  note: running on Windows — files are copied instead of symlinked.'))
    console.log(chalk.yellow('        run `ai-bridge sync` after each change to .ai/\n'))
  }
}
