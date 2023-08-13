export function getMatchImport(str: string) {
  const importRegexAll = /import {?\s*([\w\W]+?)\s*}? from ['"](.+)['"]/g

  const matchAll = str.match(importRegexAll) ?? []
  const result: any[] = []

  for (const item of matchAll)
    result.push(matchImport(item))

  return result.length ? result : ['', '']

  function matchImport(itemImport: string) {
    const importRegex = /import {?\s*([\w\W]+?)\s*}? from ['"](.+)['"]/
    const match = itemImport.match(importRegex) ?? []
    return [match[1] ?? '', match[2] ?? '']
  }
}

export function getMatchExport(str: string) {
  const exportAllReg = /export\s(?:default)?.*?(\w+)/sg
  const exportAll = str.match(exportAllReg) ?? []
  const result = []

  for (const _export of exportAll) {
    const resultMatch = matchExport(_export)
    resultMatch && result.push(resultMatch)
  }

  return result

  function matchExport(str: string) {
    const exportReg = /export\s(?:default)?.*?(\w+)/s
    return str.match(exportReg)?.[1]
  }
}
