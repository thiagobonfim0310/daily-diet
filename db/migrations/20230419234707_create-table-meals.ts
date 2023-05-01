import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.text('name').notNullable()
    table.text('description')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.boolean('is_out_diet').notNullable()
    table
      .uuid('user_id')
      .references('users.id')
      .notNullable()
      .onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
