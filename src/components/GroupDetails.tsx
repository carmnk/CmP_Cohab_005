import { Flex, CTextField, Button } from '@cmk/fe_utils'
import { Box, Typography, useTheme } from '@mui/material'
import { useCallback, useState } from 'react'
import { Icon } from '@mdi/react'
import { mdiCheckCircleOutline, mdiEmailFastOutline } from '@mdi/js'
import { API } from '../api/API'
import { formatUserName } from '../utils/formatUsername'

export type GroupDetailsProps = {
  data?: any
  updateUser?: () => Promise<void>
}

const invits = [
  { id: '1', admin_user_id: 'admin1@cohab.eu', invitee_email: 'a@a.aa' },
  { id: '2', admin_user_id: 'admin1@cohab.au', invitee_email: 'b@b.bb' },
]
const sentInvits = [
  { id: '1', admin_user_id: 'admin1@cohab.eu', invitee_email: 'a@a.aa' },
  { id: '2', admin_user_id: 'admin1@cohab.au', invitee_email: 'b@b.bb' },
]

export const GroupDetails = (props: GroupDetailsProps) => {
  const { data, updateUser } = props

  const [formData, setFormData] = useState({ email: '' })
  const handleChange = (newValue: string, e) => {
    console.log('handleChange', newValue, e)
    setFormData({
      ...formData,
      [e.target.name]: newValue,
    })
  }

  const theme = useTheme()

  const inviteUser = useCallback(async () => {
    if (!formData.email) {
      alert('Please enter an email address')
      return
    }
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regexEmail.test(formData.email)) {
      alert('Please enter a valid email address')
      return
    }
    try {
      const resInvite = await API.sendGroupInvitation.query({
        invitee_email: formData.email,
      })
      console.log('resInvite', resInvite)
      if (resInvite?.data?.success) {
        alert('Invitation sent successfully!')
        updateUser?.()
      } else {
        alert('Failed to send invitation. Please try again.')
      }
    } catch (error) {
      console.error('Error sending invitation:', error)
      const errorMessage =
        error?.status === 409
          ? 'An invitation has already been sent to this email address.'
          : 'An error occurred while sending the invitation. Please try again.'
      alert(errorMessage)
    }
  }, [formData.email])

  const acceptInvitation = useCallback(
    async (group_invitation_id: number) => {
      const resAccpeptInvite = await API.acceptGroupInvitation.query({
        group_invitation_id,
      })
      console.log('resInvite', resAccpeptInvite)
      if (resAccpeptInvite?.data?.success) {
        alert('Invitation accepted!')
        updateUser?.()
      } else {
        alert('Failed to accept invitation. Please try again.')
      }
    },
    [updateUser]
  )

  const userGroup = data?.user?.groups?.[0]
  const isGroupAdmin = userGroup?.group_admin_user_id === data?.user?.user_id
  const invitations = data?.user?.group_invitations || []
  const sentInvitations =
    data?.user?.sent_group_invitations.filter(
      (invitation) => invitation.invitation_status !== 'completed'
    ) || []

  return (
    <Box mt={1}>
      {invitations?.length ? (
        <Box>
          <Flex alignItems="flex-start" gap={1} mb={1}>
            <Icon
              path={mdiCheckCircleOutline}
              size={2}
              color={theme.palette.primary.main}
            />
            <Box>
              <Typography>You have a group invitation: </Typography>
              <Box mt={0.5}>
                {invitations.map((invitation: any) => (
                  <Flex key={invitation.id} mt={0.5}>
                    <Typography>
                      from{' '}
                      <Box component="span" fontWeight={500}>
                        {formatUserName(invitation)} ({invitation.email})
                      </Box>
                      {/* {invitation.invitee_email}{" "}
                    {invitation.invitee_user_id
                      ? `(id:${invitation.invitee_user_id})`
                      : ""} */}
                    </Typography>
                    <Box ml={2}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          acceptInvitation(invitation.group_invitation_id)
                        }
                      >
                        Accept Invitation
                      </Button>
                    </Box>
                  </Flex>
                ))}
              </Box>
            </Box>
          </Flex>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2">
            • You have currentlys no invitation for a group{' '}
          </Typography>
        </Box>
      )}
      {sentInvitations?.length ? (
        <Box mt={1}>
          <Typography variant="body2">
            • You have sent a group invitation:{' '}
          </Typography>
          {sentInvitations.map((invitation: any) => (
            <Flex key={invitation.id} mt={0.5} gap={1} alignItems="center">
              <Icon
                path={mdiEmailFastOutline}
                size={1}
                color={theme.palette.primary.main}
              />
              <Typography>to {invitation.invitee_email}</Typography>
            </Flex>
          ))}
        </Box>
      ) : null}
      <Box>
        <Box mt={1}>
          <Typography variant="body2">
            {isGroupAdmin
              ? '• Invite more users to your group'
              : `• ${
                  invitations?.length ? 'Or start ' : 'Start '
                } a group by inviting
            a user to your group}`}
          </Typography>
        </Box>
        <Flex alignItems="center" gap={1} mt={1}>
          <Box width={240}>
            <CTextField
              name="email"
              label="email"
              value={formData.email}
              onChange={handleChange}
              size="small"
            />
          </Box>

          <Box>
            <Button variant="outlined" onClick={inviteUser} size="small">
              Invite To your Group
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}
