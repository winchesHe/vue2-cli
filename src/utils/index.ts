import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export * from './word'
export * from './spinner'
export * from './sleep'
export * from './paths'
export * from './match'
export * from './detect'
export * from './color'

export const root = resolve(fileURLToPath(import.meta.url), '../../..')
export const cwd = process.cwd()
export const pkgDir = resolve(fileURLToPath(import.meta.url), '../..')
export const resolver = (url: string) => resolve(root, url)
