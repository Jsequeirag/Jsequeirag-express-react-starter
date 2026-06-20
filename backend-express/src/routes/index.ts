import { Router } from 'express'
import { createItemsRouter } from '../modules/items/items.routes.js'
import { createAuthRouter } from '../modules/auth/auth.routes.js'
import type { ItemsRepository, UsersRepository } from '../types/index.js'

export interface ApiRouterOptions {
  itemsRepository: ItemsRepository
  usersRepository: UsersRepository
}

export const createApiRouter = (options: ApiRouterOptions) => {
  const { itemsRepository, usersRepository } = options
  const router = Router()

  router.get('/', (_req, res) => {
    res.send('Hello World!')
  })

  router.use('/items', createItemsRouter(itemsRepository))
  router.use('/auth', createAuthRouter(usersRepository))

  return router
}

export default createApiRouter
