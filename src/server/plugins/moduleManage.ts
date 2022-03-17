import { FastifyPluginCallback } from 'fastify'
import {
  installModule,
  removeModule,
  updateModule,
  listModule,
} from '../../pnpm'
import { Static, Type } from '@sinclair/typebox'

const Modules = Type.Array(Type.String())
const ModuleList = Type.Record(Type.String(), Type.String())
type ModuleListType = Static<typeof ModuleList>
type ModulesType = Static<typeof Modules>

const moduleManage: FastifyPluginCallback = (fastify, opts, done) => {
  const path = '/mm'
  fastify.get<{ Reply: ModuleListType }>(
    path,
    {
      schema: {
        description: '列出所有安装的模块',
        tags: ['模块管理'],
        response: {
          200: ModuleList,
        },
      },
    },
    listModule,
  )

  fastify.post<{ Body: ModulesType; Reply: string }>(
    path,
    {
      schema: {
        description: '安装模块',
        tags: ['模块管理'],
        body: Modules,
        response: {
          200: Type.String(),
        },
      },
    },
    async (req) => await installModule(...req.body),
  )


  fastify.put<{ Body: ModulesType; Reply: string }>(
    path,
    {
      schema: {
        description: '更新模块',
        tags: ['模块管理'],
        body: Modules,
        response: {
          200: Type.String(),
        },
      },
    },
    async (req) => await updateModule(...req.body),
  )

  fastify.delete<{ Body: ModulesType; Reply: string }>(
    path,
    {
      schema: {
        description: '卸载模块',
        tags: ['模块管理'],
        body: Modules,
        response: {
          200: Type.String(),
        },
      },
    },
    async (req) => await removeModule(...req.body),
  )
  
  done()
}

export default moduleManage
