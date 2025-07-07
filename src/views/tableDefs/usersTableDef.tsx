import { AlertDialog, Button } from '@cmk/fe_utils'
import { formatUserName } from '../../utils/formatUsername'
import { mdiStar, mdiDotsVertical, mdiClose, mdiAccountKey } from '@mdi/js'
import {
  Tooltip,
  Badge,
  useTheme,
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import Icon from '@mdi/react'
import { Fragment } from 'react/jsx-runtime'
import { useCallback, useRef, useState } from 'react'
import { AppControllerData } from '../../appController/types/appControllerData'
import { CAvatar } from '../../components/CAvatar'

export type UsersTableDefParams = {
  data: AppControllerData
  removeUserFromGroup?: (user_id: number) => Promise<void>
  makeUserNewGroupAdmin?: (user_id: number) => Promise<void>
}

export const usersTableDef = (params: UsersTableDefParams) => {
  const { data, removeUserFromGroup, makeUserNewGroupAdmin } = params
  const userGroup = data?.user?.groups?.[0]
  const groupMembers = userGroup?.group_members ?? []

  return {
    data: groupMembers, //[{ column1: "ABCD", column2: "EFGH" }],
    columns: [
      {
        header: 'Name',
        renderCell: (item) => <td>{formatUserName(item)}</td>,
      },
      {
        header: 'Email',
        renderCell: (item) => (
          <td>
            <Typography textOverflow="ellipsis" overflow="hidden">
              {item?.email}
            </Typography>
          </td>
        ),
      },
      {
        style: { width: '3rem' },
        header: '',
        renderCell: (item) => (
          <td>
            <Tooltip
              title={
                userGroup?.group_admin_user_id === item.user_id && 'Group Admin'
              }
              placement="top"
              arrow
            >
              <Badge
                badgeContent={
                  userGroup?.group_admin_user_id === item.user_id && (
                    <Icon path={mdiStar} size={0.75} color="orange" />
                  )
                }
              >
                <CAvatar size={32} user={item} />
              </Badge>
            </Tooltip>
          </td>
        ),
      },
      {
        style: { width: '2rem' },
        header: '',
        renderCell: (item, iIdx) => (
          <Fragment key={iIdx}>
            {userGroup?.group_admin_user_id === data?.user?.user_id && (
              <MoreActionsColumn
                item={item}
                removeUserFromGroup={removeUserFromGroup}
                makeUserNewGroupAdmin={makeUserNewGroupAdmin}
              />
            )}
          </Fragment>
        ),
      },
    ],
  }
}

const anchorOrigin = {
  vertical: 'bottom' as const,
  horizontal: 'center' as const,
}
const transformOrigin = {
  vertical: 'top' as const,
  horizontal: 'center' as const,
}
const alertProps = {
  slotProps: {
    paper: {
      sx: { maxWidth: '90%', width: 600 },
    },
    confirmButton: {
      color: 'secondary' as const,
    },
    cancelConfirmButton: {
      color: 'secondary' as const,
    },
  },
  sx: {
    '& .MuiPaper-root': {
      minWidth: 'auto',
    },
  },
}

type MoreActionsColumnProps = {
  item: any
  removeUserFromGroup?: (user_id: number) => Promise<void>
  makeUserNewGroupAdmin?: (user_id: number) => Promise<void>
}

const MoreActionsColumn = (props: MoreActionsColumnProps) => {
  const { item, removeUserFromGroup, makeUserNewGroupAdmin } = props
  const theme = useTheme()
  const ref = useRef(null)

  const [ui, setUi] = useState({
    openMenu: false,
    openDeleteConfirm: false,
    openMakeNewGroupAdminConfirm: false,
  })

  const handleToggleOpenMenu = useCallback(() => {
    setUi((current) => ({ ...current, openMenu: !current.openMenu }))
  }, [])
  const handleToggleOpenConfirmDelete = useCallback(() => {
    setUi((current) => ({
      ...current,
      openDeleteConfirm: !current.openDeleteConfirm,
    }))
  }, [])
  const handleToggleOpenNewAdminConfirmDelete = useCallback(() => {
    setUi((current) => ({
      ...current,
      openMakeNewGroupAdminConfirm: !current.openMakeNewGroupAdminConfirm,
    }))
  }, [])

  const handleRemoveUserFromGroup = useCallback(async () => {
    await removeUserFromGroup?.(item?.user_id)
    setUi((current) => ({ ...current, openMenu: false }))
  }, [removeUserFromGroup, item])

  const handleMakeUserNewGroupAdmin = useCallback(async () => {
    await makeUserNewGroupAdmin?.(item?.user_id)
    setUi((current) => ({ ...current, openMakeNewGroupAdminConfirm: false }))
  }, [makeUserNewGroupAdmin, item])

  const handleRequestMakeNewGroupAdmin = useCallback(() => {
    setUi((current) => ({
      ...current,
      openMenu: false,
      openMakeNewGroupAdminConfirm: true,
    }))
  }, [])

  const handleRequestRemoveUserFromGroup = useCallback(() => {
    setUi((current) => ({
      ...current,
      openMenu: false,
      openDeleteConfirm: true,
    }))
  }, [])

  return (
    <Fragment key={item?.user_id}>
      <Box>
        <Button
          variant="outlined"
          iconButton
          icon={mdiDotsVertical}
          onClick={handleToggleOpenMenu}
          ref={ref}
        />
      </Box>
      <Menu
        open={ui.openMenu}
        anchorEl={ref.current}
        onClose={handleToggleOpenMenu}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        <MenuItem onClick={handleRequestMakeNewGroupAdmin}>
          <ListItemIcon>
            <Icon path={mdiAccountKey} size={1} />
          </ListItemIcon>
          <ListItemText>Make New Group Admin</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRequestRemoveUserFromGroup}>
          <ListItemIcon>
            <Icon path={mdiClose} size={1} color={theme.palette.error.light} />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.light' }}>
            Remove From Group
          </ListItemText>
        </MenuItem>
      </Menu>
      <AlertDialog
        disableCloseOnConfirmation
        {...alertProps}
        width={320}
        minWidth={320}
        header="Please confirm to remove this user from the group"
        subheader="this action cannot be undone"
        open={ui.openDeleteConfirm}
        onClose={handleToggleOpenConfirmDelete}
        isConfirmation
        cancelConfirmationLabel="Cancel"
        confirmationLabel="REMOVE USER"
        onConfirm={handleRemoveUserFromGroup}
      />
      <AlertDialog
        disableCloseOnConfirmation
        {...alertProps}
        width={320}
        minWidth={320}
        header="Please confirm to make this user the new group admin"
        subheader="this action cannot be undone without the new group admin"
        open={ui.openMakeNewGroupAdminConfirm}
        onClose={handleToggleOpenNewAdminConfirmDelete}
        isConfirmation
        cancelConfirmationLabel="Cancel"
        confirmationLabel="MAKE NEW GROUP ADMIN"
        onConfirm={handleMakeUserNewGroupAdmin}
      />
    </Fragment>
  )
}
