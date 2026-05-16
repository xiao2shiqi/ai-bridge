import fs from 'fs'
import path from 'path'

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

export function createSymlinkOrCopy(target: string, linkPath: string, useCopy: boolean): void {
  // lstatSync detects broken symlinks that existsSync misses; ignore ENOENT
  let pathExists = false
  try { fs.lstatSync(linkPath); pathExists = true } catch { pathExists = false }
  if (pathExists) {
    fs.rmSync(linkPath, { recursive: true, force: true })
  }

  if (useCopy) {
    fs.cpSync(target, linkPath, { recursive: true })
  } else {
    const relativeTarget = path.relative(path.dirname(linkPath), target)
    fs.symlinkSync(relativeTarget, linkPath, 'junction')
  }
}

export function safeCreateSymlinkOrCopy(target: string, linkPath: string, useCopy: boolean): void {
  if (!fs.existsSync(target)) return
  try {
    createSymlinkOrCopy(target, linkPath, useCopy)
  } catch {
    // fall back to copy if symlink fails (e.g. Windows without privileges)
    fs.cpSync(target, linkPath, { recursive: true })
  }
}

export function isWindows(): boolean {
  return process.platform === 'win32'
}
