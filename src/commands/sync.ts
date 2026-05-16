import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import chalk from 'chalk'
import { UnifiedConfig } from '../adapters/types.js'
import { generateClaudeSettings } from '../adapters/claude.js'
import { generateCodexConfig } from '../adapters/codex.js'

export async function syncCommand(): Promise<void> {
  const cwd = process.cwd()
  const configPath = path.join(cwd, '.ai', 'config.yaml')

  console.log(chalk.bold('\nai-bridge sync\n'))

  if (!fs.existsSync(configPath)) {
    console.error(chalk.red('  error: .ai/config.yaml not found. Run `ai-bridge init` first.'))
    process.exit(1)
  }

  const raw = fs.readFileSync(configPath, 'utf-8')
  const config = yaml.load(raw) as UnifiedConfig ?? {}

  // Claude Code → .claude/settings.json
  generateClaudeSettings(config, cwd)
  console.log(chalk.green('  synced ') + '  .claude/settings.json')

  // Codex → .codex/config.toml
  generateCodexConfig(config, cwd)
  console.log(chalk.green('  synced ') + '  .codex/config.toml')

  const mcpCount = Object.keys(config.mcp_servers ?? {}).length
  const hookEvents = Object.keys(config.hooks ?? {}).length
  console.log(chalk.gray(`\n  ${mcpCount} MCP server(s), ${hookEvents} hook event(s) synced\n`))
}
