// eslint-disable-next-line
import { knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
    }
    meals: {
      name: string
      description: string
      is_out_diet: boolean
      user_id: string
      id: string
    }
  }
}
