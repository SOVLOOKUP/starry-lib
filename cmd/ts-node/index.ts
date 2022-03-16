import { main as tsNode } from 'ts-node/dist/bin'
import type { Command } from 'commander'

export default (program: Command) =>
  program
    .command('ts-node [file] [execPath]')
    .action(async (file, execPath) => {
      const argv = file ? [file, '--esm'] : []
      const args = {
        '--cwd': execPath,
      }
      try {
        tsNode(argv, {
          '--swc': true,
          ...args,
        })
        console.log('Ts-node repl started, press Ctrl+D to exit')
        process.stdin.on('data', (data) => {
          data.toJSON().data[0] === 4 && process.exit()
        })
      } catch (err) {
        console.log(err)
        process.exit()
      }
    })
