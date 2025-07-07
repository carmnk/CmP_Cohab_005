import { Avatar, Box, Typography } from '@mui/material'
import { formatUserName } from '../../utils/formatUsername'
import { useCallback, useState } from 'react'
import { Button, ColorPicker, CTextField, Flex } from '@cmk/fe_utils'
import { mdiCheck, mdiPencil } from '@mdi/js'
import { API } from '../../api/API'
import { getUserInitials } from '../../utils/getUserInitials'
import { AppControllerData } from '../../appController/types/appControllerData'
import { CAvatar } from '../../components/CAvatar'
import toast from 'react-hot-toast'

export type UsersYouSectionProps = {
  data: AppControllerData
  userImageSrc: string | null
  updateUser?: () => Promise<void>
  disableEdit?: boolean
}
// declare const BASE_URL: string

export const UsersYouSection = (props: UsersYouSectionProps) => {
  const { data, userImageSrc, updateUser, disableEdit } = props
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
      toast.error('Username must not be empty')
      return
    }
    try {
      const resChangeQuerry = await API.changeUsername.query(formData)
      updateUser?.()
      setUi((current) => ({ ...current, isEditUserName: false }))
    } catch (e) {
      toast.error('error changing Username')
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
        toast.error('Usercolor must not be empty')
        return
      }
      try {
        const resChangeQuerry = await API.changeUserColor.query({
          user_color: newValue,
        })
        updateUser?.()
      } catch (e) {
        toast.error('error changing Username')
        setFormData((current) => ({
          ...current,
          user_color: user?.user_color as string,
        }))
      }
    },
    [updateUser, user]
  )

  return (
    <Box>
      <Flex width={'100%'} gap={'3rem'}>
        <Box>
          {!disableEdit && (
            <Typography variant="h6" fontWeight="bold">
              You
            </Typography>
          )}
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
                {!disableEdit && (
                  <Button
                    iconButton
                    icon={mdiPencil}
                    variant="outlined"
                    onClick={handleToggleEditUserName}
                  />
                )}
              </Flex>
            )}
            <Typography>{user?.email}</Typography>
            <Flex mt={'1rem'} alignItems="center" gap="0.5rem">
              <Typography variant="body1">User Color</Typography>
              {!disableEdit && (
                <>
                  <ColorPicker
                    value={user?.user_color}
                    disableThemeColors
                    onChange={handleSubmitChangeUserColor}
                    disabled={disableEdit}
                  />
                  <Typography variant="body2" fontStyle="italic">
                    Preview
                  </Typography>
                </>
              )}
              <CAvatar
                sx={{
                  // background: user?.user_color,
                  // width: 30,
                  // height: 30,
                  ml: '0.5rem',
                }}
                user={user}
              />
            </Flex>
          </Box>
        </Box>

        {!disableEdit && (
          <Box
            mt="1rem"
            height="4rem"
            width="4rem"
            overflow="hidden"
            borderRadius={9999}
            border={`5px solid ${user?.user_color ?? '#666'}`}
          >
            {userImageSrc && userImageSrc.startsWith('data:image') ? (
              <img src={userImageSrc} alt="user" width={64} height={64} />
            ) : (
              <CAvatar
                sx={{
                  width: 'calc(4rem - 10px)',
                  height: 'calc(4rem - 10px)',
                  // background: user?.user_color,
                  fontSize: '2rem',
                }}
                user={user}
              />
            )}
          </Box>
        )}
      </Flex>
    </Box>
  )
}
