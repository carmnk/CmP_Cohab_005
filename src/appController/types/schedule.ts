import { ScheduleEntry } from './scheduleEntry'

export type Schedule = {
  schedule_id: number
  schedule_name: string
  schedule_description: string
  period: null
  period_start: null
  is_recurring: boolean
  user_id: number
  group_id: number
  schedule_entrys: ScheduleEntry[]
}
