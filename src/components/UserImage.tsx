import { Box } from '@mui/material'
import { memo } from 'react'
import { getUserInitials } from '../utils/getUserInitials'
import { CAvatar } from './CAvatar'
import { AppControllerActions } from '../appController/useAppControllerActions'
import { AppControllerData } from '../appController/types/appControllerData'
import { AppControllerUi } from '../appController/types/appControllerUi'
import { MobileDrawer } from './MobileDrawer'

export type UserImageProps = {
  src?: string
  userImage: string | null | undefined
  data: AppControllerData
  actions: AppControllerActions
  ui: AppControllerUi
}

const pointerCursor = {
  cursor: 'pointer',
}

export const UserImageComponent = (props: UserImageProps) => {
  const { src, data, actions, userImage, ui } = props
  const { user } = data
  const { toggleDrawerOpen } = actions

  return (
    <>
      <Box
        borderRadius={9999}
        key="user-image-box"
        width={32}
        height={32}
        overflow={'hidden'}
        // border={'3px solid ' + user?.user_color}
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
