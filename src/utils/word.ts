/**
 * 将命名转换为短横线命名
 *
 * @param value 需要转换的命名
 */
export function toKebabCase(value: string) {
  return (
    value.charAt(0).toLowerCase()
      + value
        .slice(1)
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
  )
}
