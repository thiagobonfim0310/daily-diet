import { FastifyInstance } from 'fastify'

import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const users = await knex('users').select()

    return { users }
  })
  app.post('/auth', async (request, reply) => {
    const authUserBodyShcema = z.object({
      name: z.string(),
      email: z.string(),
    })

    const { name, email } = authUserBodyShcema.parse(request.body)

    const user = await knex('users').where({ name, email }).select()

    return { user }
  })
  app.post('/', async (request, reply) => {
    const createUserBodyShcema = z.object({
      name: z.string(),
      email: z.string(),
    })
    const { name, email } = createUserBodyShcema.parse(request.body)

    await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      email,
    })

    return reply.status(201).send()
  })
}
