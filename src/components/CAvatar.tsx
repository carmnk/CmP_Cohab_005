import { Avatar, AvatarProps } from '@mui/material'
import { getUserInitials } from '../utils/getUserInitials'
import { PublicUser } from '../appController/types/publicUser'
import { CSSProperties } from 'react'
import { getContrastRatio } from '@mui/system'

export type CAvatarProps = AvatarProps & {
  user: PublicUser | undefined | null
  size?: CSSProperties['width']
}

export const CAvatar = (props: CAvatarProps) => {
  const { user, size = 30, ...rest } = props
  const userColor = user?.user_color
  const contrastRatio = getContrastRatio('#ffffff', userColor as string)

  return (
    <Avatar
      {...rest}
      sx={{
        background: userColor,
        width: size,
        height: size,
        color: contrastRatio && contrastRatio < 2 ? '#000' : 'fff',
        // ml: '0.5rem',
        ...(rest?.sx ?? {}),
      }}
    >
      {getUserInitials(user)}
    </Avatar>
  )
}
