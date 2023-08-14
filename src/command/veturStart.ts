/* eslint-disable no-console */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { printColorLogs, printErrorLogs, printSuccessLogs } from '@winches/utils'
import input from '@inquirer/input'
import type { ParserResult } from '@vuese/parser'
import { parser } from '@vuese/parser'
import prettier from 'prettier'
import type { VeturConfig } from '../cli'
import { cwd, generateSmoothGradient, getMatchExport, getMatchImport, normalizePath, setExtPath, sleep, spinner, toKebabCase } from '../utils'

let prefixName: string
let docs: string
export const tagJson: any = {}
export const attributeJson: any = {}
const enterKey = '\n\r'

const defaultBanner = '欢迎使用 vetur 安装工具'
const gradientBanner = printColorLogs(defaultBanner)
const COLORS = generateSmoothGradient('#5ffbf1', '#86a8e7', 8).reverse()

export async function veturStart(config: VeturConfig) {
  console.log(
    (process.stdout.isTTY && process.stdout.getColorDepth() > 8)
      ? `🚀 ${gradientBanner}`
      : defaultBanner,
  )
  console.log()

  const { path, mode, name, prefix, docs: _docs } = config

  if (!prefix) {
    prefixName = await input({ message: '请输入组件的前缀' })
    console.log()
  }
  else {
    prefixName = prefix
  }

  const _while = () => {
    return run()
  }
  await spinner({
    start: printColorLogs('vetur 正在安装中...'),
    while: _while,
    colorArr: COLORS,
  })

  async function run() {
    await sleep(3000)

    if (mode === 'collect') {
      const resolvePath = resolve(cwd, path)
      const isExistPath = existsSync(resolvePath)

      if (!isExistPath) {
        printErrorLogs('请输入一个正确的组件库导出数组地址')
        process.exit(1)
      }

      docs = _docs

      const fileContent = readFileSync(resolvePath, 'utf-8')
      const match = fileContent.match(new RegExp(`.*${name}.*?\\[(.*)\\]`, 's'))?.[1] || ''
      const compArr = match.split(',').map(i => i.trim())
      const importArr = getMatchImport(fileContent)
      const compRest: [string, string][] = []

      for (const [_import, _importPath] of importArr) {
        for (const comp of compArr) {
          if (_import.includes(comp)) {
            const normalizedPath = normalizePath(_importPath, path)
            const normalizeName = toKebabCase(comp)
            if (normalizedPath)
              compRest.push([normalizeName, normalizedPath])
          }
        }
      }

      for (const [name, path] of compRest) {
        const convertPath = extname(path) ? path : setExtPath(path)
        const _content = readFileSync(convertPath, 'utf-8')
        const isMatchIndexComp = isIndexComp(_content)

        if (isMatchIndexComp) {
          const parseComp = parseCompFile(convertPath, _content)

          // 转换组件vetur信息
          transformCompResult(parseComp, name)
          continue
        }

        const transformIndexArr = transformIndexComp(_content, convertPath)

        for (const [comp, compPath] of transformIndexArr) {
          const convertPath = extname(compPath) ? compPath : setExtPath(compPath)
          const _content = readFileSync(convertPath, 'utf-8')
          const parseComp = parseCompFile(convertPath, _content)

          // 转换组件vetur信息
          transformCompResult(parseComp, comp)
        }
      }
    }

    const veturDir = resolve(cwd, 'vetur')
    const veturTagsPath = resolve(veturDir, 'tags.json')
    const veturAttrPath = resolve(veturDir, 'attributes.json')

    const tagsOutput = await prettier.format(JSON.stringify(tagJson), { parser: 'json-stringify' })
    const attrOutput = await prettier.format(JSON.stringify(attributeJson), { parser: 'json-stringify' })
    mkdirSync(veturDir, { recursive: true })
    writeFileSync(veturTagsPath, tagsOutput, 'utf-8')
    writeFileSync(veturAttrPath, attrOutput, 'utf-8')

    printSuccessLogs('✨ 安装 vetur !')
  }
}

function isIndexComp(content: string) {
  const matchCompReg = /name: .*/
  return matchCompReg.test(content)
}

function parseCompFile(path: string, content: string) {
  let parseComp: ParserResult | null = null
  const isJs = path.includes('.js')

  try {
    if (isJs) {
      parseComp = parser(content, {
        jsFile: true,
      })
    }
    else {
      parseComp = parser(content)
    }
  }
  catch (error) {
    console.log('该路径内容解析失败: ', path)
    console.log('报错内容: ', error)
  }

  return parseComp
}

function transformIndexComp(content: string, activePath = '') {
  const exportArr = getMatchExport(content).map(i => i.trim())
  const importArr = getMatchImport(content)
  const result = []

  for (const [_import, importPath] of importArr) {
    for (const _export of exportArr) {
      if (_import.includes(_export)) {
        const normalizedPath = normalizePath(importPath, activePath)
        const normalizeName = toKebabCase(_import.trim())
        if (normalizedPath)
          result.push([normalizeName, normalizedPath])
      }
    }
  }

  return result
}

function transformCompResult(result: ParserResult | null, compName: string) {
  if (!result)
    return

  const _tagDesc = result.componentDesc?.default?.[0] || ''
  const compDesc = compName.includes(prefixName) ? compName.replace(`${prefixName}-`, '') : compName
  const tag = compName.includes(prefixName) ? compName : `${prefixName.toLowerCase()}-${compName}`
  const tagDesc = docs ? `${tag}${enterKey}文档地址：${docs}/${compDesc}${enterKey}${_tagDesc}` : `${tag}${enterKey}${_tagDesc}`
  const tagAttr: any[] = []

  result.props?.forEach((prop) => {
    tagAttr.push(`${prop.name}`)
    attributeJson[`${tag}/${prop.name}`] = {
      description: prop.describe,
      type: prop.type,
    }
  })
  result.events?.forEach((event) => {
    tagAttr.push(`${event.name}`)
    attributeJson[`${tag}/${event.name}`] = {
      description: event.describe,
      type: 'event',
    }
  })

  tagJson[tag] = {
    description: tagDesc,
    attributes: tagAttr,
  }
}
