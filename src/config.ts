import path from 'path'
import { env } from './utils'

export default {
  basePath: env('BASE_PATH', path.resolve(process.cwd(), 'starry')),
  port: env('PORT', '3000'),
  log: env('LOG', 'true'),
}
