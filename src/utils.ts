import fs from 'fs-extra'
import path from 'path'

const env = (name: string, defaultValue: string): string => {
  const value = process.env[name]
  if (value === undefined || value === '') {
    return defaultValue
  }

  return value
}

const initDataDir = async (dataPath: string) => {
  await fs.ensureDir(dataPath)
  if (!(await fs.pathExists(path.resolve(dataPath, 'setup.json')))) {
    await fs.writeJSON(path.resolve(dataPath, 'setup.json'), [])
  }
}

export { env, initDataDir }
