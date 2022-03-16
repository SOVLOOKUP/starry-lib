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
  return (await fs.readJSON(path.resolve(modulePath, 'package.json')))
    .dependencies
}

// todo 通过 ts-node load ts插件
const loadModule = async (path: string): Promise<unknown> => {
  let m = await import(path)

  // cjs
  if (m?.default !== undefined) {
    m = m.default
  }

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
