import { FastifyPluginCallback } from 'fastify'
import { loadModule } from '../../pnpm'
import { Static, Type } from '@sinclair/typebox'
import fs from 'fs-extra'
import { resolve } from 'path'
import config from '../../config'

const setupPath = resolve(config.basePath, 'modules', 'setup.json')

const moduleRunner: FastifyPluginCallback = (fastify, opts, done) => {
  const path = '/mm/:moduleName'

  fastify.get(
    '/mm/all',
    {
      schema: {
        description: '列出所有自启动模块',
        tags: ['模块管理'],
        response: {
          200: Type.Array(Type.String()),
        },
      },
    },
    async () => await fs.readJSON(setupPath),
  )

  fastify.post(
    path,
    {
      schema: {
        description: '添加自启动模块',
        tags: ['模块管理'],
        params: {
          moduleName: Type.String(),
        },
        response: {
          200: Type.Array(Type.String()),
        },
      },
    },
    async (req, resp) => {
      try {
        const m = (await loadModule(
          (req as { params: { moduleName: string } }).params.moduleName,
        )) as Function
        try {
          await m()
          let ml: string[] = await fs.readJSON(setupPath)
          ml.push((req as { params: { moduleName: string } }).params.moduleName)
          ml = [...new Set(ml)]
          // 去重
          await fs.writeJSON(setupPath, ml)
          return ml
        } catch (err) {
          resp.status(501).send(err)
        }
      } catch (err) {
        resp.status(404).send(err)
      }
    },
  )

  fastify.put(
    path,
    {
      schema: {
        description: '运行模块',
        tags: ['模块管理'],
        params: {
          moduleName: Type.String(),
        },
        response: {},
      },
    },
    async (req, resp) => {
      try {
        const m = (await loadModule(
          (req as { params: { moduleName: string } }).params.moduleName,
        )) as Function

        try {
          resp.send(await m())
        } catch (err) {
          resp.status(501).send(err)
        }
      } catch (err) {
        resp.status(404).send(err)
      }
    },
  )

  fastify.delete(
    path,
    {
      schema: {
        description: '取消模块自启动',
        tags: ['模块管理'],
        params: {
          moduleName: Type.String(),
        },
        response: {
          200: Type.Array(Type.String()),
        },
      },
    },
    async (req) => {
      const ml: string[] = await fs.readJSON(setupPath)
      await fs.writeJSON(
        setupPath,
        ml.filter(
          (item) =>
            item !==
            (req as { params: { moduleName: string } }).params.moduleName,
        ),
      )
      return ml
    },
  )

  done()
}

export default moduleRunner
