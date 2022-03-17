import path from 'path'
import fs from 'fs-extra'
import config from '../config'
import { execPnpm, initModulesDir } from './utils'

const modulePath = path.resolve(config.basePath, 'modules')

const installModule = async (...name: string[]): Promise<string> =>
  await execPnpm(modulePath, ['add', ...name])

const removeModule = async (...name: string[]): Promise<string> =>
  await execPnpm(modulePath, ['rm', ...name])

const updateModule = async (...name: string[]): Promise<string> =>
  await execPnpm(modulePath, ['update', ...name])

const listModule = async (): Promise<{ [name: string]: string }> => {
  return (
    (await fs.readJSON(path.resolve(modulePath, 'package.json')))
      ?.dependencies ?? {}
  )
}

const loadModule = async (moduleName: string): Promise<unknown> => {
  // import
  let i = await import(path.resolve(modulePath, 'index.js'))
  // cjs
  if (i?.default !== undefined) {
    i = i.default
  }
  let m = await i(moduleName)
  // cjs
  if (m?.default !== undefined) {
    m = m.default
  }
  // target module
  return m
}

export {
  installModule,
  removeModule,
  updateModule,
  listModule,
  initModulesDir,
  loadModule,
}
