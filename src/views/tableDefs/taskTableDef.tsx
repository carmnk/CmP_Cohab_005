import { AlertDialog, Button, Checkbox, Flex } from '@cmk/fe_utils'
import {
  mdiAccountGroup,
  mdiCalendarAlert,
  mdiCalendarAlertOutline,
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
  Badge,
  Box,
} from '@mui/material'
import { formatUserName } from '../../utils/formatUsername'
import { useCallback, useRef, useState } from 'react'
import Icon from '@mdi/react'
import { getUserInitials } from '../../utils/getUserInitials'
import { Task } from '../TaskModal'
import moment from 'moment'
import { GridFilterOperator } from '@mui/x-data-grid'

export const taskTableDef = (
  data: any,
  openTaskModal: (task_id: number) => void,
  deleteTask: (task_id: number) => void,
  createOrEditTask: (task: Task) => Promise<void>
) => {
  const groupMembers = data?.user?.groups?.[0]?.group_members ?? []
  const handleChangeTaskStatus = async (newValue: boolean, item: Task) => {
    console.log('handleChangeTaskStatus', newValue)
    const newFormData = {
      ...item,
      task_status: newValue ? 'completed' : 'open',
    }
    try {
      const resCreatcreateOrEditTask = await createOrEditTask(newFormData)
      console.log('Task status updated successfully:', resCreatcreateOrEditTask)
      // alert(`Task status updated to ${newFormData.task_status}`)
    } catch (e) {
      console.error('Error updating task status:', e)
      alert('Error updating task status')
    }
  }

  const statusFilterOperators: GridFilterOperator[] = [
    {
      label: 'is completed',
      value: 'completed',
      getApplyFilterFn: (filterItem, column) => {
        if (!filterItem.field || !filterItem.operator) {
          return null
        }
        console.log(
          'getApplyFilterFn statusFilterOperators',
          filterItem,
          column
        )
        return (value, row, column, apiRef) => {
          console.log(
            'getApplyFilterFn value',
            value,
            row,
            column,
            apiRef,
            value === filterItem.operator
          )
          return row?.task_status === filterItem.operator
        }
      },
      // InputComponent: RatingInputValue,
      // InputComponentProps: { type: 'number' },
    },
    {
      label: 'is open',
      value: 'open',
      getApplyFilterFn: (filterItem, column) => {
        if (!filterItem.field || !filterItem.operator) {
          return null
        }
        console.log(
          'getApplyFilterFn statusFilterOperators',
          filterItem,
          column
        )
        return (value, row, column, apiRef) => {
          console.log(
            'getApplyFilterFn value',
            value,
            row,
            column,
            apiRef,
            value === filterItem.operator
          )
          return row?.task_status === filterItem.operator
        }
      },
    },
  ]

  const groupFilterOperators: GridFilterOperator[] = [
    {
      label: 'Your Private Tasks',
      value: 'null',
      getApplyFilterFn: (filterItem, column) => {
        if (!filterItem.field || !filterItem.operator) {
          return null
        }
        return (value, row, column, apiRef) => {
          return row?.owner_group_id === null
        }
      },
    },
    ...(data?.user?.groups?.map((group) => ({
      label: group.group_name ?? 'Your Group (unnamed)',
      value: group.group_id,
      getApplyFilterFn: (filterItem, column) => {
        if (!filterItem.field || !filterItem.operator) {
          return null
        }
        return (value, row, column, apiRef) => {
          return row?.owner_group_id === filterItem.operator
        }
      },
    })) ?? []),
  ]

  return {
    data: data?.tasks, //[{ column1: "ABCD", column2: "EFGH" }],
    columns: [
      {
        field: 'task_name',
        flex: 8,
        headerName: 'Name',
        renderCell: (cellProps) => {
          const item = cellProps?.row

          return (
            <Box>
              <Typography>{item?.task_name ?? '-'}</Typography>
              {item?.due_datetime && (
                <Flex alignItems="center" gap={'0.125rem'}>
                  <Icon path={mdiCalendarAlertOutline} size={0.7} />
                  <Typography variant="body2">
                    {moment(item?.due_datetime).format('DD.MM.YYYY HH:mm')}
                  </Typography>
                </Flex>
              )}
            </Box>
          )
        },
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
        headerName: 'Created',
        field: 'creator_user_id',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        minWidth: 72,
        flex: 1,
        headerAlign: 'center',
        renderHeader: () => (
          <Flex justifyContent="center" alignItems="center">
            <Tooltip title="Task creator" placement="top" arrow>
              <Icon path={mdiPlus} size={1} />
            </Tooltip>
          </Flex>
        ),
        renderCell: (cellProps) => {
          const item = cellProps?.row

          const creatorUser = groupMembers?.find?.(
            (memb) => memb.user_id === item?.owner_user_id
          )
          // const label = creatorUser ? formatUserName(creatorUser)?.[0] : '?'
          return (
            <Box height="100%">
              <Flex alignItems="center" justifyContent="center" height="100%">
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
            </Box>
          )
        },
      },
      {
        // sortKey: "email",
        // filterKey: "column1",
        disableReorder: true,
        hideSortIcons: true,
        hideable: false,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        field: 'editors_user_ids',
        style: { width: '3rem' },
        minWidth: 80,
        flex: 1,
        headerName: 'Editors',
        headerAlign: 'center',
        renderHeader: () => (
          <Flex justifyContent="center" alignItems="center" width="100%">
            <Tooltip title="Task editors" placement="top" arrow>
              <Icon path={mdiPencil} size={1} />
            </Tooltip>
          </Flex>
        ),
        renderCell: (cellProps) => {
          const item = cellProps?.row

          const editorUserIds = item.task_editors_user_ids || []
          const editorUsers = editorUserIds.map((eUserId) =>
            groupMembers?.find((memb) => memb.user_id === eUserId)
          )
          // const label = creatorUser ? formatUserName(creatorUser)?.[0] : "?";
          return (
            <Box>
              <Tooltip
                title={editorUsers
                  .map((user) => formatUserName(user))
                  .join(', ')}
                placement="top"
                arrow
              >
                <Badge
                  badgeContent={editorUsers.length > 1 ? editorUsers.length : 0}
                  color="default"
                  slotProps={{ badge: { sx: { bgcolor: '#ddd' } } as any }}
                >
                  <Flex alignItems="center" justifyContent="center">
                    {editorUsers.slice(0, 2).map((eUser, eIdx) => (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          ml: eIdx ? -2 : undefined,
                          bgcolor: eUser?.user_color,
                        }}
                      >
                        {eUser && getUserInitials(eUser)}
                      </Avatar>
                    ))}
                  </Flex>
                </Badge>
              </Tooltip>
            </Box>
          )
        },
      },
      {
        // sortKey: "email",
        // filterKey: "column1",
        hideable: false,
        sortable: false,
        field: 'group_id',
        headerName: 'Group',
        filterOperators: groupFilterOperators,
        minWidth: 85,
        flex: 1,
        header: (
          <Flex justifyContent="center" alignItems="center">
            <Tooltip title="Task editors" placement="top" arrow>
              <Icon path={mdiAccountGroup} size={1} />
            </Tooltip>
          </Flex>
        ),
        renderCell: (cellProps) => {
          const item = cellProps?.row

          return (
            <Box height="100%">
              <Flex alignItems="center" justifyContent="center" height="100%">
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
            </Box>
          )
        },
      },
      // {
      //   // sortKey: "email",
      //   // filterKey: "column1",
      //   style: { width: '5rem' },
      //   header: (
      //     <Flex justifyContent="center" alignItems="center">
      //       <Typography>Status</Typography>
      //     </Flex>
      //   ),
      //   renderCell: (item, iIdx) => {
      //     return (
      //       <td key={iIdx}>
      //         <Flex alignItems="center" justifyContent="center">
      //           {item?.task_status === 'completed' ? (
      //             <Icon path={mdiCheck} size={1} />
      //           ) : (
      //             item?.task_status
      //           )}
      //         </Flex>
      //       </td>
      //     )
      //   },
      // },
      {
        // sortKey: "name",
        // filterKey: "column1",
        disableReorder: true,
        hideSortIcons: true,
        hideable: false,
        sortable: false,
        filterOperators: statusFilterOperators,
        field: 'field_status',
        headerName: 'Done',
        minWidth: 60,
        flex: 1,
        renderCell: (cellProps) => {
          const item = cellProps?.row
          return (
            <Flex justifyContent="center" alignItems="center">
              <Checkbox
                disableLabel
                disableHelperText
                value={item?.task_status === 'completed'}
                checked={item?.task_status === 'completed'}
                onChange={(newValue) => handleChangeTaskStatus(newValue, item)}
                slotProps={{ formControlLabel: { sx: { m: 0 } } as any }}
              />
            </Flex>
          )
        },
      },

      {
        // sortKey: "email",
        // filterKey: "column1",
        filterable: false,
        sortable: false,
        field: '_actions',
        headerName: '',
        minWidth: 48,
        flex: 1,
        disableReorder: true,
        hideSortIcons: true,
        hideable: false,
        disableColumnMenu: true,
        style: { width: '2rem' },
        header: '',
        renderCell: (cellProps) => {
          const item = cellProps?.row
          return (
            <Box height="100%" display="flex" alignItems="center">
              <MoreActionsColumn
                // index={rIdx}
                item={item}
                onOpenTaskModal={openTaskModal}
                deleteTask={deleteTask}
              />
            </Box>
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
  // index: number
  item: any
  onOpenTaskModal: (task_id: number) => void
  deleteTask: (task_id: number) => void
}

const MoreActionsColumn = (props: MoreActionsColumnProps) => {
  const { item, onOpenTaskModal, deleteTask } = props
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
