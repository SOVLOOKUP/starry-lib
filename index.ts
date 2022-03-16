import { createCommand } from 'commander'
import pkgjson from './package.json'
import tsNodeCmd from './cmd/ts-node'
import main from './src'

const program = createCommand(pkgjson.name)
  .version(pkgjson.version)
  .description(pkgjson.description)

// 集成 ts-node
tsNodeCmd(program)

// 默认执行
program.argument('[moduleInstallPath]').action(main)
program.parse()
