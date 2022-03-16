import path from 'path'
import { initModulesDir } from './pnpm'
import fs from 'fs-extra'
import config from './config'
import startServer from './server'

const main = async () => {
  // 确保已经初始化
  const modulePath = path.resolve(config.basePath, 'modules')
  fs.ensureDir(config.basePath)
  await initModulesDir(modulePath)
  await startServer()
}

export default main
