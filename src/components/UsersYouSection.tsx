import { Avatar, Box, Chip, Stack, Typography } from '@mui/material'
import { formatUserName } from '../utils/formatUsername'
import { useCallback, useState } from 'react'
import { Button, ColorPicker, CTextField, Flex } from '@cmk/fe_utils'
import { mdiCheck, mdiPencil } from '@mdi/js'
import { API } from '../api/API'
import { getUserInitials } from '../utils/getUserInitials'

export type UsersYouSectionProps = {
  data: any
  userImageSrc: string | null
  updateUser?: () => Promise<void>
}
declare const BASE_URL: string

export const UsersYouSection = (props: UsersYouSectionProps) => {
  const { data, userImageSrc, updateUser } = props
  const user = data?.user

  const [formData, setFormData] = useState({
    user_name: formatUserName(user),
    user_color: '',
  })

  const handleChangeUsername = useCallback((newValue: string) => {
    setFormData((current) => ({ ...current, user_name: newValue }))
  }, [])
  const [ui, setUi] = useState({
    isEditUserName: false,
  })

  const handleToggleEditUserName = useCallback(() => {
    setUi((current) => ({
      ...current,
      isEditUserName: !current.isEditUserName,
    }))
  }, [])

  const handleSubmitChangeUserName = useCallback(async () => {
    if (!formData?.user_name) {
      alert('Username must not be empty')
      return
    }
    try {
      const resChangeQuerry = await API.changeUsername.query(formData)
      updateUser?.()
      setUi((current) => ({ ...current, isEditUserName: false }))
    } catch (e) {
      alert('error changing Username')
      setFormData((current) => ({
        ...current,
        user_name: formatUserName(user),
      }))
      setUi((current) => ({ ...current, isEditUserName: false }))
    }
  }, [formData, updateUser, user])

  const handleSubmitChangeUserColor = useCallback(
    async (newValue: string) => {
      if (!newValue) {
        alert('Usercolor must not be empty')
        return
      }
      try {
        const resChangeQuerry = await API.changeUserColor.query({
          user_color: newValue,
        })
        updateUser?.()
        // setUi((current) => ({ ...current, isEditUse rName: false }))
      } catch (e) {
        alert('error changing Username')
        setFormData((current) => ({
          ...current,
          // user_name: formatUserName(user),
          user_color: user?.user_color,
        }))
        // setUi((current) => ({ ...current, isEditUserName: false }))
      }
    },
    [updateUser, user]
  )

  return (
    <Box>
      <Flex width={'100%'} gap={'3rem'}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            You
          </Typography>
          <Box mt={1}>
            {ui.isEditUserName ? (
              <Flex alignItems="center" mb={'0.5rem'} gap="0.5rem">
                <CTextField
                  value={formData?.user_name ?? ''}
                  size="small"
                  label="User Name"
                  disableHelperText
                  onChange={handleChangeUsername}
                />
                <Box mt={'1.5rem'}>
                  <Button
                    iconButton
                    icon={mdiCheck}
                    variant="outlined"
                    onClick={handleSubmitChangeUserName}
                  />
                </Box>
              </Flex>
            ) : (
              <Flex alignItems="center" gap={'1rem'} mb={'0.5rem'}>
                <Typography>{formData?.user_name}</Typography>
                <Button
                  iconButton
                  icon={mdiPencil}
                  variant="outlined"
                  onClick={handleToggleEditUserName}
                />
              </Flex>
            )}
            <Typography>{user?.email}</Typography>
            <Flex mt={'1rem'} alignItems="center" gap="0.5rem">
              <Typography variant="body1">User Color</Typography>
              <ColorPicker
                value={user?.user_color}
                disableThemeColors
                onChange={handleSubmitChangeUserColor}
              />
              <Typography variant="body2" fontStyle="italic">
                Preview
              </Typography>
              <Avatar
                sx={{
                  background: user?.user_color,
                  width: 30,
                  height: 30,
                  ml: '0.5rem',
                }}
              >
                {user?.user_name && getUserInitials?.(user)}
              </Avatar>
            </Flex>
          </Box>
        </Box>

        <Box
          mt="1rem"
          height="4rem"
          width="4rem"
          overflow="hidden"
          borderRadius={9999}
          border={`5px solid ${user?.user_color ?? '#666'}`}
        >
          {userImageSrc && userImageSrc.startsWith('data:image') && (
            <img src={userImageSrc} alt="user" width={64} height={64} />
          )}
        </Box>
      </Flex>
    </Box>
  )
}
