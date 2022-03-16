// curd modules
import fastify from 'fastify'
import config from '../config'
import swagger from 'fastify-swagger'
import moduleManager from './plugins/moduleManage'
import pkgjson from '../../package.json'

const server = fastify({ logger: true })

server.register(swagger as any, {
  routePrefix: '/doc',
  openapi: {
    info: {
      title: pkgjson.name,
      description: pkgjson.description,
      version: pkgjson.version,
      contact: pkgjson.author,
      license: pkgjson.license,
    },
  },
  hideUntagged: true,
  exposeRoute: true,
})

server.register(moduleManager, {
  prefix: '/api',
})

const startServer = async () => {
  try {
    await server.listen({ port: config.port })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

export default startServer
