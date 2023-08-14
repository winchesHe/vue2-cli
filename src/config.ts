import input from '@inquirer/input'
import type { VeturConfig } from './cli'

interface Args {
  /** Non-option arguments */
  _: Array<string | number>
  /** The script name or node command */
  $0: string
  /** All remaining options */
  [argName: string]: any
}

export async function normalizeConfig(args: Args): Promise<VeturConfig> {
  const { name, path, mode, prefix, docs: _docs } = args
  let docs: string = _docs

  if (!_docs)
    docs = (await input({ message: '请输入组件库文档地址' })).replace(/\/$/, '')

  return {
    name,
    path,
    mode,
    prefix,
    docs,
  }
}
