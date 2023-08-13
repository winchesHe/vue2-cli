#!/usr/bin/env node
/* eslint-disable no-unused-expressions */
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import c from 'chalk'
import { gitStart, veturStart } from './command'
import { normalizeConfig } from './config'

export interface VeturConfig {
  path: string
  name: string
  prefix: string
  docs: string
  mode: 'collect'
}

yargs(hideBin(process.argv))
  .scriptName('vue2-cli')
  .usage('usage: $0 <command> [options]')
  .command(
    'vetur [mode]',
    '对组件库进行 Vetur 配置的获取',
    (args) => {
      return args
        .positional('mode', {
          default: 'collect',
          type: 'string',
          describe: '对 Vetur 进行的操作，可选项："collect"',
          choices: ['collect'],
        })
        .option('name', {
          alias: 'n',
          type: 'string',
          default: 'components',
          describe: '全部组件数组常量的名称',
        })
        .option('path', {
          alias: 'p',
          type: 'string',
          describe: '导出全部组件的位置',
        })
        .option('prefix', {
          type: 'string',
          describe: '组件的前缀',
        })
        .option('docs', {
          alias: 'd',
          type: 'boolean',
          default: false,
          describe: '是否需要组件文档地址',
        })
        .demandOption('path', c.yellow('请为命令添加 path 选项值'))
    },
    async (args) => {
      const config = await normalizeConfig(args)

      await veturStart(config)
    },
  )
  .command(
    'inject-hooks',
    '为项目注入 post-merge 和 post-rebase hooks，监听lock文件变化，并自动更新依赖',
    (args) => {
      return args
    },
    gitStart,
  )
  .demandCommand(1, '请输入运行的命令')
  .example('$0 vetur [mode]', '随后开始进行 Vetur 的安装')
  .alias('h', 'help')
  .alias('v', 'version')
  .help()
  .argv
