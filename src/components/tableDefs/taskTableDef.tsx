import { AlertDialog, Button, Flex } from '@cmk/fe_utils'
import {
  mdiAccountGroup,
  mdiCheck,
  mdiDelete,
  mdiDotsVertical,
  mdiPencil,
  mdiPlus,
} from '@mdi/js'
import {
  Typography,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material'
import { formatUserName } from '../../utils/formatUsername'
import { useCallback, useRef, useState } from 'react'
import Icon from '@mdi/react'
import { getUserInitials } from '../../utils/getUserInitials'

export const taskTableDef = (
  data: any,
  openTaskModal: (task_id: number) => void,
  deleteTask: (task_id: number) => void
) => {
  const groupMembers = data?.user?.groups?.[0]?.group_members ?? []

  return {
    data: data?.tasks, //[{ column1: "ABCD", column2: "EFGH" }],
    columns: [
      // {
      //   // sortKey: "name",
      //   // filterKey: "column1",
      //   header: "ID",
      //   renderCell: "task_id",
      // },
      {
        // sortKey: "email",
        // filterKey: "column1",
        header: 'Name/Description',
        renderCell: (item, iIdx) => (
          <td key={iIdx}>
            <Typography>{item?.task_name ?? '-'}</Typography>
            <Typography variant="body2">
              {item?.task_description ?? ''}
            </Typography>
          </td>
        ),
      },
      // {
      //   // sortKey: "email",
      //   // filterKey: "column1",
      //   style: { width: "3.5rem" },
      //   header: "Private",
      //   renderCell: (item, iIdx) => {
      //     return (
      //       <td key={iIdx}>
      //         <Flex justifyContent="center" alignItems="center">
      //           {!item?.owner_group_id && (
      //             <Icon path={mdiCheck} size={1} color="limegreen" />
      //           )}
      //         </Flex>
      //       </td>
      //     );
      //   },
      // },
      {
        // sortKey: "email",
        // filterKey: "column1",
        style: { width: '4rem' },
        header: (
          <Flex justifyContent="center" alignItems="center">
            <Tooltip title="Task creator" placement="top" arrow>
              <Icon path={mdiPlus} size={1} />
            </Tooltip>
          </Flex>
        ),
        renderCell: (item, iIdx) => {
          const creatorUser = groupMembers?.find?.(
            (memb) => memb.user_id === item?.owner_user_id
          )
          const label = creatorUser ? formatUserName(creatorUser)?.[0] : '?'
          return (
            <td key={iIdx}>
              <Flex alignItems="center" justifyContent="center">
                <Tooltip
                  title={formatUserName(creatorUser)}
                  placement="top"
                  arrow
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      background: creatorUser?.user_color,
                    }}
                  >
                    {creatorUser && getUserInitials(creatorUser)}
                  </Avatar>
                </Tooltip>
              </Flex>
            </td>
          )
        },
      },
      {
        // sortKey: "email",
        // filterKey: "column1",
        style: { width: '3rem' },
        header: (
          <Flex justifyContent="center" alignItems="center">
            <Tooltip title="Task editors" placement="top" arrow>
              <Icon path={mdiPencil} size={1} />
            </Tooltip>
          </Flex>
        ),
        renderCell: (item, iIdx) => {
          const editorUserIds = item.task_editors_user_ids || []
          const editorUsers = editorUserIds.map((eUserId) =>
            groupMembers?.find((memb) => memb.user_id === eUserId)
          )
          // const label = creatorUser ? formatUserName(creatorUser)?.[0] : "?";
          return (
            <td key={iIdx}>
              <Flex alignItems="center" justifyContent="center">
                {editorUsers.map((eUser) => (
                  <Tooltip title={formatUserName(eUser)} placement="top" arrow>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        ml: -1.5,
                        bgcolor: eUser?.user_color,
                      }}
                    >
                      {eUser && getUserInitials(eUser)}
                    </Avatar>
                  </Tooltip>
                ))}
              </Flex>
            </td>
          )
        },
      },
      {
        // sortKey: "email",
        // filterKey: "column1",
        style: { width: '3rem' },
        header: (
          <Flex justifyContent="center" alignItems="center">
            <Typography>Group</Typography>
          </Flex>
        ),
        renderCell: (item, iIdx) => {
          return (
            <td key={iIdx}>
              <Flex alignItems="center" justifyContent="center">
                {item?.owner_group_id && (
                  // <Button
                  //   iconButton
                  //   variant="outlined"
                  //   icon={mdiAccountGroup}
                  //   size={'small'}
                  //   color="success"
                  //   tooltip={
                  //     item?.owner_group_id
                  //       ? data?.user?.groups?.find(
                  //           (gr) => gr.group_id === item?.owner_group_id
                  //         )?.group_name
                  //       : 'Your group (unnamed)'
                  //   }
                  // />

                  <Icon path={mdiCheck} size={1} />
                )}
              </Flex>
            </td>
          )
        },
      },
      {
        // sortKey: "email",
        // filterKey: "column1",
        style: { width: '5rem' },
        header: (
          <Flex justifyContent="center" alignItems="center">
            <Typography>Status</Typography>
          </Flex>
        ),
        renderCell: (item, iIdx) => {
          return (
            <td key={iIdx}>
              <Flex alignItems="center" justifyContent="center">
                {item?.task_status === 'completed' ? (
                  <Icon path={mdiCheck} size={1} />
                ) : (
                  item?.task_status
                )}
              </Flex>
            </td>
          )
        },
      },

      {
        // sortKey: "email",
        // filterKey: "column1",
        style: { width: '2rem' },
        header: '',
        renderCell: (item, rIdx, cIdx) => {
          return (
            <MoreActionsColumn
              index={rIdx}
              item={item}
              onOpenTaskModal={openTaskModal}
              deleteTask={deleteTask}
            />
          )
        },
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

export type MoreActionsColumnProps = {
  index: number
  item: any
  onOpenTaskModal: (task_id: number) => void
  deleteTask: (task_id: number) => void
}

const MoreActionsColumn = (props: MoreActionsColumnProps) => {
  const { index, item, onOpenTaskModal, deleteTask } = props
  const theme = useTheme()
  const ref = useRef(null)

  const [ui, setUi] = useState({
    openMenu: false,
    openDeleteConfirm: false,
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

  const handleEditItem = useCallback(() => {
    onOpenTaskModal?.(item?.task_id)
    setUi((current) => ({ ...current, openMenu: false }))
  }, [])
  const handleDeleteItem = useCallback(() => {
    handleToggleOpenConfirmDelete()
    setUi((current) => ({ ...current, openMenu: false }))
  }, [])

  const handleConfirmedDelete = useCallback(() => {
    // alert("Send deletion request here for task_id=" + item?.task_id);
    deleteTask(item?.task_id)
    setUi((current) => ({
      ...current,
      openMenu: false,
      openDeleteConfirm: false,
    }))
  }, [item, deleteTask])
  return (
    <>
      <td key={index} ref={ref}>
        <Button
          variant="outlined"
          iconButton
          icon={mdiDotsVertical}
          onClick={handleToggleOpenMenu}
        />
      </td>
      <Menu
        open={ui.openMenu}
        anchorEl={ref.current}
        onClose={handleToggleOpenMenu}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        <MenuItem onClick={handleEditItem}>
          <ListItemIcon>
            <Icon path={mdiPencil} size={1} />
          </ListItemIcon>
          <ListItemText>Edit Task</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteItem}>
          <ListItemIcon>
            <Icon path={mdiDelete} size={1} color={theme.palette.error.light} />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.light' }}>Delete Task</ListItemText>
        </MenuItem>
      </Menu>
      <AlertDialog
        disableCloseOnConfirmation
        {...alertProps}
        width={320}
        minWidth={320}
        header="Please confirm to delete this task"
        subheader="this action cannot be undone"
        open={ui.openDeleteConfirm}
        onClose={handleToggleOpenConfirmDelete}
        isConfirmation
        cancelConfirmationLabel="Cancel"
        confirmationLabel="DELETE"
        onConfirm={handleConfirmedDelete}
      />
    </>
  )
}
