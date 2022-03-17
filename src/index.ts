import path from 'path'
import { initModulesDir, loadModule } from './pnpm'
import fs from 'fs-extra'
import config from './config'
import startServer from './server'
import { initDataDir } from './utils'

const main = async () => {
  // 确保已经初始化
  const modulePath = path.resolve(config.basePath, 'modules')
  fs.ensureDir(config.basePath)
  await initModulesDir(modulePath)
  await initDataDir(modulePath)
  await startServer()

  // 启动自启动模块
  const mnames: string[] = await fs.readJSON(
    path.resolve(modulePath, 'setup.json'),
  )
  for await (const name of mnames) {
    const m = (await loadModule(name)) as Function
    const res = await m()
    console.log(name, res)
  }
}

main()
