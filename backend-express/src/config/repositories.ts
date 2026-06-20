import { env } from './env.js'
import { MemoryItemsRepository } from '../modules/items/items.memory-repository.js'
import { PrismaItemsRepository } from '../modules/items/items.prisma-repository.js'
import { MemoryUsersRepository } from '../modules/auth/auth.memory-repository.js'
import { PrismaUsersRepository } from '../modules/auth/auth.prisma-repository.js'
import type { ItemsRepository, UsersRepository } from '../types/index.js'

const hasDatabase = Boolean(env.DATABASE_URL)

export const createItemsRepository = (): ItemsRepository => {
  return hasDatabase ? new PrismaItemsRepository() : new MemoryItemsRepository()
}

export const createUsersRepository = (): UsersRepository => {
  return hasDatabase ? new PrismaUsersRepository() : new MemoryUsersRepository()
}

export { hasDatabase }
