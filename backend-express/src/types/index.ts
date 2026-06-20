export interface Item {
  id: string | number
  name: string
  description: string | null
  createdAt?: Date
  updatedAt?: Date
}

export type CreateItemDto = {
  name: string
  description?: string
}

export type UpdateItemDto = Partial<CreateItemDto>

export interface User {
  id: string
  email: string
  name: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface UserWithPassword extends User {
  password: string
}

export type CreateUserDto = {
  email: string
  password: string
  name?: string
}

export interface ItemsRepository {
  findAll(): Item[] | Promise<Item[]>
  findById(id: string | number): Item | null | Promise<Item | null>
  create(data: CreateItemDto): Item | Promise<Item>
  update(id: string | number, data: UpdateItemDto): Item | null | Promise<Item | null>
  delete(id: string | number): boolean | Promise<boolean>
  reset?(): void
}

export interface UsersRepository {
  findByEmail(email: string): UserWithPassword | null | Promise<UserWithPassword | null>
  findById(id: string): User | null | Promise<User | null>
  create(data: CreateUserDto): UserWithPassword | Promise<UserWithPassword>
  reset?(): void
}

export interface ApiSuccessResponse<T> {
  success: true
  message: string
  data: T
}

export interface ApiErrorResponse {
  success: false
  code: string
  message: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
