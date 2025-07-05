import { Group } from './group'
import { GroupInvitation } from './groupInvitation'
import { PublicUser } from './publicUser'

export type User = PublicUser & {
  type: 'google'
  photo_url: string
  group_id: number
  role: string
  stripe_customer_id: null
  subscription_type: 'free'
  subscription_expiry_date: string
  group_invitations: GroupInvitation[]
  groups: Group[]
  sent_group_invitations: GroupInvitation[]
}
