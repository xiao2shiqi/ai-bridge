export type McpServer = {
  command: string
  env?: Record<string, string>
}

export type Hook = {
  command: string
  matcher?: string
  timeout?: number
}

export type UnifiedConfig = {
  mcp_servers?: Record<string, McpServer>
  hooks?: Record<string, Hook[]>
}
