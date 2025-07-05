export type GroupInvitation = {
  group_invitation_id: number
  admin_user_id: number
  invitee_user_id: number
  invitation_status: string
  created_at: string
  invitee_email: string
  group_id: string | null
}
