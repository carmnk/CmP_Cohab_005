import {
  Box,
  Divider,
  Popover,
  Stack,
  SwipeableDrawer,
  Typography,
  useTheme,
} from '@mui/material'
import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserInitials } from '../utils/getUserInitials'
import { CAvatar } from './CAvatar'
import { AppControllerActions } from '../appController/useAppControllerActions'
import { Button, Flex, ListNavigation } from '@cmk/fe_utils'
import {
  mdiArrowTopRight,
  mdiCheckboxMarkedCirclePlusOutline,
  mdiCalendar,
  mdiAccountGroup,
} from '@mdi/js'
import { UsersYouSection } from '../views/users/UsersYouSection'
import { AppControllerData } from '../appController/types/appControllerData'
import { AppControllerUi } from '../appController/types/appControllerUi'
import { MobileDrawer } from './MobileDrawer'

export type UserImageProps = {
  src?: string
  // user: User | null
  userImage: string | null | undefined
  data: AppControllerData
  actions: AppControllerActions
  ui: AppControllerUi
}
declare const BASE_URL: string

const pointerCursor = {
  cursor: 'pointer',
}

export const UserImageComponent = (props: UserImageProps) => {
  const { src, data, actions, userImage, ui } = props
  const { user } = data
  const { toggleDrawerOpen } = actions

  const adjPathName1 =
    location.pathname === '/'
      ? 'index'
      : location.pathname.replace(BASE_URL, '') || 'index'
  const adjPathName = adjPathName1.startsWith('/')
    ? adjPathName1.slice(1)
    : adjPathName1

  const navigateRaw = useNavigate()
  const navigate = useCallback(
    (to: string) => {
      const toAdj = to.startsWith('/') ? to.slice(1) : to
      console.log('navigate', to, 'toAdj', toAdj)
      navigateRaw(toAdj)
    },
    [navigateRaw]
  )
  const theme = useTheme()

  return (
    <>
      <Box
        borderRadius={9999}
        key="user-image-box"
        width={32}
        height={32}
        overflow={'hidden'}
        border={'3px solid ' + user?.user_color}
        // onClick={() => navigate('/users')}
        onClick={toggleDrawerOpen}
        sx={pointerCursor}
      >
        {src && src.startsWith('data:image') ? (
          <img src={src} alt="User Image" width={32} />
        ) : (
          <CAvatar size={32} user={user}>
            {user && getUserInitials(user)}
          </CAvatar>
        )}
      </Box>
      <MobileDrawer
        data={data}
        userImage={userImage}
        actions={actions}
        ui={ui}
      />
    </>
  )
}
export const UserImage = memo(UserImageComponent)
