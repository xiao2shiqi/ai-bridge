#!/usr/bin/env node
import { Command } from 'commander'
import { initCommand } from './commands/init.js'
import { syncCommand } from './commands/sync.js'

const program = new Command()

program
  .name('ai-bridge')
  .description('Unified configuration bridge for AI coding tools')
  .version('0.1.0')

program
  .command('init')
  .description('Initialize .ai/ directory and create symlinks for supported tools')
  .option('--no-symlinks', 'Copy files instead of creating symlinks (for Windows compatibility)')
  .action(initCommand)

program
  .command('sync')
  .description('Sync .ai/config.yaml to tool-specific config files (.claude/settings.json, .codex/config.toml)')
  .action(syncCommand)

program.parse()
