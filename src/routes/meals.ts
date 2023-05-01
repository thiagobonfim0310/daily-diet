import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import crypto from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealsBodySchema = z.object({
      userId: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      isOutDiet: z.boolean(),
    })

    const { userId, name, description, isOutDiet } =
      createMealsBodySchema.parse(request.body)

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name,
      description,
      is_out_diet: isOutDiet,
      user_id: userId,
    })

    return reply.status(201).send()
  })

  app.get('/:userId', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getMealsParamsSchema.parse(request.params)

    const meals = await knex('meals').where({ user_id: userId })

    return { meals }
  })

  app.get('/:userId/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      userId: z.string().uuid(),
      id: z.string().uuid(),
    })

    const { userId, id } = getMealsParamsSchema.parse(request.params)

    const meal = await knex('meals').where({ user_id: userId, id }).first()

    return { meal }
  })

  app.put('/:userId/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      userId: z.string().uuid(),
      id: z.string().uuid(),
    })
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOutDiet: z.boolean(),
    })

    const { userId, id } = getMealsParamsSchema.parse(request.params)

    const { name, description, isOutDiet } = createMealsBodySchema.parse(
      request.body,
    )

    await knex('meals')
      .update({ name, description, is_out_diet: isOutDiet, user_id: userId })
      .where({ user_id: userId, id })

    return reply.status(204).send()
  })

  app.delete('/:userId/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      userId: z.string().uuid(),
      id: z.string().uuid(),
    })

    const { userId, id } = getMealsParamsSchema.parse(request.params)

    await knex('meals').where({ user_id: userId, id }).delete()

    return reply.status(204).send()
  })

  app.get('/parametersDiet/:userId', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getMealsParamsSchema.parse(request.params)

    const meals = (
      await knex('meals')
        .count('is_out_diet as meals')
        .where({ user_id: userId })
        .first()
    )?.meals
    const inDiet = (
      await knex('meals')
        .count('is_out_diet as inDiet')
        .where({ user_id: userId, is_out_diet: true })
        .first()
    )?.inDiet
    const outDiet = (
      await knex('meals')
        .count('is_out_diet as outDiet')
        .where({ user_id: userId, is_out_diet: false })
        .first()
    )?.outDiet
    return { meals, inDiet, outDiet }
  })

  app.get('/sequenceDiet/:userId', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getMealsParamsSchema.parse(request.params)

    const meals = await knex('meals').where({ user_id: userId })

    let sequence = []
    let bestsequence = []
    meals.forEach((meal) => {
      if (meal.is_out_diet) {
        sequence.push(meal)
      }
      if (!meal.is_out_diet) {
        if (bestsequence.length <= sequence.length) {
          bestsequence = sequence
        }

        sequence = []
      }
    })
    if (bestsequence.length <= sequence.length) {
      bestsequence = sequence
    }

    return { bestsequence }
  })
}
