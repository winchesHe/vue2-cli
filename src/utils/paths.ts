import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import os from 'node:os'

export const isWin = os.platform() === 'win32'

export function normalizePath(path: string, activePath = '') {
  if (path.startsWith('.'))
    return resolve(join(activePath, '..', path))
}

export function setExtPath(url: string) {
  const ext = ['.vue', '.js', '.ts']

  for (const item of ext) {
    const extPath = `${url}${item}`
    const extIndexPath = `${url}${isWin ? '\\' : '/'}index${item}`

    if (existsSync(extPath))
      return extPath
    if (existsSync(extIndexPath))
      return extIndexPath
  }
  return url
}
