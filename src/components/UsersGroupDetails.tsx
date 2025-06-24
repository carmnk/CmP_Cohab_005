import { Flex, CTextField, Button, Table } from '@cmk/fe_utils'
import { Box, Typography, useTheme } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { Icon } from '@mdi/react'
import {
  mdiCheck,
  mdiCheckCircleOutline,
  mdiEmailFastOutline,
  mdiPencil,
} from '@mdi/js'
import { API } from '../api/API'
import { formatUserName } from '../utils/formatUsername'
import { usersTableDef } from './tableDefs/usersTableDef'

export type GroupDetailsProps = {
  data?: any
  updateUser?: () => Promise<void>
}

// const invits = [
//   { id: '1', admin_user_id: 'admin1@cohab.eu', invitee_email: 'a@a.aa' },
//   { id: '2', admin_user_id: 'admin1@cohab.au', invitee_email: 'b@b.bb' },
// ]
// const sentInvits = [
//   { id: '1', admin_user_id: 'admin1@cohab.eu', invitee_email: 'a@a.aa' },
//   { id: '2', admin_user_id: 'admin1@cohab.au', invitee_email: 'b@b.bb' },
// ]
// const groupMembers = [
//   { user_id: 1, user_name: 'Test User 1', email: 'test@1.test' },
//   { user_id: 2, user_name: 'Test User 1', email: 'test@1.test' },
// ]

export const GroupDetails = (props: GroupDetailsProps) => {
  const { data, updateUser } = props

  const userGroup = data?.user?.groups?.[0]
  const isGroupAdmin = userGroup?.group_admin_user_id === data?.user?.user_id

  const [formData, setFormData] = useState({ email: '' })

  const [groupFormData, setGroupFormData] = useState({
    group_name: userGroup?.group_name,
  })
  const [ui, setUi] = useState({
    isEditUserName: false,
  })

  const handleToggleEditUserName = useCallback(() => {
    setUi((current) => ({
      ...current,
      isEditUserName: !current.isEditUserName,
    }))
  }, [])

  const handleChangeGroupname = useCallback((newValue: string) => {
    setGroupFormData((current) => ({ ...current, group_name: newValue }))
  }, [])

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
  }, [formData.email, updateUser])

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

  const handleSubmitChangeGroupName = useCallback(async () => {
    if (!groupFormData?.group_name) {
      alert('Grouname must not be empty')
      return
    }
    try {
      const resChangeQuerry = await API.changeGroupName(
        userGroup?.group_id
      ).query(groupFormData)
      updateUser?.()
      setUi((current) => ({ ...current, isEditUserName: false }))
    } catch (e) {
      alert('error changing Groupname')
      setFormData((current) => ({
        ...current,
        group_name: userGroup?.group_name ?? '',
      }))
      setUi((current) => ({ ...current, isEditUserName: false }))
    }
  }, [groupFormData, updateUser, userGroup])

  const invitations =
    data?.user?.group_invitations?.filter(
      (invitation) => invitation.invitation_status !== 'completed'
    ) || []
  const sentInvitations =
    data?.user?.sent_group_invitations?.filter(
      (invitation) => invitation.invitation_status !== 'completed'
    ) || []

  const hasUserGroup = !!data?.user?.groups?.length

  const tableDef = useMemo(() => {
    return usersTableDef(data)
  }, [data])

  return (
    <Box mt={'1rem'} minHeight="8rem">
      <Typography variant="h6" fontWeight="bold">
        Your Group
      </Typography>

      {hasUserGroup ? (
        <Flex alignItems="center" gap="1rem">
          {ui.isEditUserName ? (
            <>
              <CTextField
                label="Change Group Name"
                size="small"
                value={groupFormData.group_name}
                onChange={handleChangeGroupname}
              />
              <Button
                variant="outlined"
                iconButton
                icon={mdiCheck}
                onClick={handleSubmitChangeGroupName}
              />
            </>
          ) : (
            <>
              <Typography
                color={userGroup?.group_name ? undefined : 'text.secondary'}
                fontStyle={userGroup?.group_name ? undefined : 'italic'}
              >
                {userGroup?.group_name
                  ? `${userGroup.group_name}`
                  : 'Specify group name'}
              </Typography>
              <Button
                variant="outlined"
                iconButton
                icon={mdiPencil}
                onClick={handleToggleEditUserName}
              />
            </>
          )}
        </Flex>
      ) : (
        <Flex>
          <Typography
            color={userGroup?.group_name ? undefined : 'text.secondary'}
            fontStyle={userGroup?.group_name ? undefined : 'italic'}
          >
            {'Your are not yet part of any group'}
          </Typography>
        </Flex>
      )}
      {hasUserGroup && <Table {...tableDef} />}

      {(!hasUserGroup || isGroupAdmin) && (
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
      )}
    </Box>
  )
}
