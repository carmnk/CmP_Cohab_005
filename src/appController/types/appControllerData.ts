import { Schedule } from './schedule'
import { Task } from './tasks'
import { User } from './user'

export type AppControllerData = {
  user: User | null
  tasks: Task[]
  schedules: Schedule[]
}
