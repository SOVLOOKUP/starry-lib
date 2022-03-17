import { createCommand } from 'commander'
import pkgjson from '../package.json'
import start, { main } from './start'
import dotenv from 'dotenv'

dotenv.config()

const program = createCommand(pkgjson.name)
  .version(pkgjson.version)
  .description(pkgjson.description)

// 启动命令
start(program)

program.parse()

export default main
