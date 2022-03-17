import { Worker } from 'worker_threads'
import path from 'path'
import fs from 'fs-extra'

const initModulesDir = async (dir: string): Promise<void> => {
  await fs.ensureDir(dir)
  const pkgJsonPath = path.resolve(dir, 'package.json')
  const indexPath = path.resolve(dir, 'index.js')
  if (!(await fs.pathExists(pkgJsonPath))) {
    await fs.writeJSON(pkgJsonPath, {
      type: 'module',
      main: 'index.js',
      dependencies: {},
    })
  }

  if (!(await fs.pathExists(indexPath))) {
    await fs.writeFile(
      indexPath,
      'export default async name => await import(name)',
    )
  }
}

const execPnpm = async (execPath: string, argv: string[]): Promise<string> =>
  await new Promise((resolve, reject) => {
    const currentPath = process.cwd()
    process.chdir(execPath)
    const worker = new Worker(
      path.resolve(
        path.parse(decodeURI(new URL(import.meta.url).pathname)).dir,
        '../..',
        'node_modules/pnpm/dist/pnpm.cjs',
      ),
      {
        argv,
        stdout: true,
      },
    )

    worker.on('exit', () => {
      process.chdir(currentPath)
      resolve(worker.stdout.setEncoding('utf8').read())
    })
    worker.on('error', (e) => {
      reject(e)
    })
  })

export { execPnpm, initModulesDir }
