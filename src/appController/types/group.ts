import { PublicUser } from './publicUser'

export type Group = {
  group_id: number
  group_name: string
  group_admin_user_id: number
  create_at: string
  group_members: PublicUser[]
}
