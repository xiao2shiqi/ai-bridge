import fs from 'fs'
import path from 'path'
import { UnifiedConfig } from './types.js'

type ClaudeSettings = {
  mcpServers?: Record<string, { command: string; args?: string[]; env?: Record<string, string> }>
  hooks?: Record<string, Array<{ matcher?: string; hooks: Array<{ type: string; command: string }> }>>
}

export function generateClaudeSettings(config: UnifiedConfig, outputDir: string): void {
  const settings: ClaudeSettings = {}

  if (config.mcp_servers && Object.keys(config.mcp_servers).length > 0) {
    settings.mcpServers = {}
    for (const [name, server] of Object.entries(config.mcp_servers)) {
      const [cmd, ...args] = server.command.split(' ')
      settings.mcpServers[name] = { command: cmd, args }
      if (server.env) settings.mcpServers[name].env = server.env
    }
  }

  if (config.hooks && Object.keys(config.hooks).length > 0) {
    settings.hooks = {}
    for (const [event, hookList] of Object.entries(config.hooks)) {
      settings.hooks[event] = hookList.map(h => ({
        matcher: h.matcher ?? '.*',
        hooks: [{ type: 'command', command: h.command }],
      }))
    }
  }

  const outPath = path.join(outputDir, '.claude', 'settings.json')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(settings, null, 2) + '\n')
}
