import { main as tsNode } from 'ts-node/dist/bin'
import type { Command } from 'commander'
import path from 'path'

const main = async () => {
  const argv = [
    path.resolve(
      path.parse(decodeURI(new URL(import.meta.url).pathname)).dir,
      '../src/index.js',
    ),
    '--esm',
  ]
  try {
    tsNode(argv, {
      '--swc': true,
    })
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

export default (program: Command) => program.command('start').action(main)
export { main }
