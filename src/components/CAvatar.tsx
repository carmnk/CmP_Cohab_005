import { Avatar, AvatarProps } from '@mui/material'
import { getUserInitials } from '../utils/getUserInitials'
import { PublicUser } from '../appController/types/publicUser'
import { CSSProperties } from 'react'

export type CAvatarProps = AvatarProps & {
  user: PublicUser | undefined | null
  size?: CSSProperties['width']
}

export const CAvatar = (props: CAvatarProps) => {
  const { user, size = 30, ...rest } = props
  return (
    <Avatar
      {...rest}
      sx={{
        background: user?.user_color,
        width: size,
        height: size,
        // ml: '0.5rem',
        ...(rest?.sx ?? {}),
      }}
    >
      {getUserInitials(user)}
    </Avatar>
  )
}
