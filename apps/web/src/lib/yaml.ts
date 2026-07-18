import { parse } from 'yaml'

export function yamlToJson(input: string, indent: number): string {
  const value = parse(input)
  return JSON.stringify(value, null, indent)
}
