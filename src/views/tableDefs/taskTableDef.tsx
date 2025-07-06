import { AlertDialog, Button, Checkbox, Flex } from '@cmk/fe_utils'
import {
  mdiAccount,
  mdiAccountGroup,
  mdiAccountPlus,
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
import moment from 'moment'
import { GridFilterOperator } from '@mui/x-data-grid'
import { AppControllerData } from '../../appController/types/appControllerData'
import { Task } from '../../appController/types/tasks'
import { CAvatar } from '../../components/CAvatar'

export const taskTableDef = (
  data: AppControllerData,
  openTaskModal: (task_id: number) => void,
  deleteTask: (task_id: number) => void,
  createOrEditTask: (task: Task) => Promise<void>,
  isMinSmViewport: boolean
) => {
  const userGroup = data?.user?.groups?.[0]
  const groupMembers = userGroup?.group_members ?? []
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
    ...(data?.user?.groups?.map?.((group) => ({
      label: group.group_name ?? 'Your Group (unnamed)',
      value: group.group_id as any,
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
        disableReorder: true,
        hideSortIcons: true,
        hideable: false,
        sortable: false,
        filterOperators: statusFilterOperators,
        field: 'field_status',
        key: 'field_status',
        headerName: 'Done',
        minWidth: 60,
        flex: 1,
        renderCell: (cellProps) => {
          const item = cellProps?.row
          return (
            <Flex
              justifyContent="center"
              alignItems="center"
              key={'field_status'}
            >
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
        field: 'task_name',
        key: 'task_name',
        flex: 8,
        // minWidth: 80,
        headerName: 'Name',
        renderCell: (cellProps) => {
          const item = cellProps?.row
          const userGroup = item?.owner_group_id
            ? data?.user?.groups?.find(
                (gr) => gr.group_id === item?.owner_group_id
              )?.group_name
            : 'Private'
          const createUser = groupMembers?.find(
            (member) => member.user_id === item?.owner_user_id
          )
          return (
            <Box key={'task_name'}>
              <Typography>{item?.task_name ?? '-'}</Typography>

              <Flex alignItems="center" gap={'0.125rem'}>
                <Icon path={mdiCalendarAlertOutline} size={0.7} />
                <Typography variant="body2">
                  {item?.due_datetime
                    ? moment(item?.due_datetime).format('DD.MM.YYYY HH:mm')
                    : '-'}
                </Typography>
              </Flex>
              {!isMinSmViewport && (
                <Flex alignItems="center" gap={'0.125rem'}>
                  <Tooltip
                    title={
                      item?.owner_group_id
                        ? 'This task is shared with group: ' + userGroup
                        : 'This task is private - only you can see'
                    }
                    arrow
                    placement="top"
                  >
                    <Flex alignItems="center">
                      <Icon
                        path={
                          item?.owner_group_id ? mdiAccountGroup : mdiAccount
                        }
                        size={0.7}
                      />
                      <Typography variant="body2">{userGroup}</Typography>
                    </Flex>
                  </Tooltip>
                  <Typography variant="body2">{` | `}</Typography>

                  <Tooltip
                    title={'Task created by ' + createUser?.user_name}
                    arrow
                    placement="top"
                  >
                    <Flex alignItems="center">
                      <Icon path={mdiAccountPlus} size={0.7} />

                      <Box pl="0.25rem">
                        <CAvatar
                          user={createUser}
                          size={14}
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                    </Flex>
                  </Tooltip>
                </Flex>
              )}
            </Box>
          )
        },
      },
      ...(!isMinSmViewport
        ? []
        : [
            {
              headerName: 'Created',
              field: 'creator_user_id',
              key: 'creator_user_id',
              sortable: false,
              filterable: false,
              disableColumnMenu: true,
              maxWidth: 80,
              width: 80,
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
                return (
                  <Box height="100%" key={'creator_user_id'}>
                    <Flex
                      alignItems="center"
                      justifyContent="center"
                      height="100%"
                    >
                      <Tooltip
                        title={formatUserName(creatorUser)}
                        placement="top"
                        arrow
                      >
                        <CAvatar size={32} user={creatorUser} />
                      </Tooltip>
                    </Flex>
                  </Box>
                )
              },
            },
          ]),
      {
        disableReorder: true,
        hideSortIcons: true,
        hideable: false,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        field: 'editors_user_id',
        key: 'editors_user_id',
        // style: { width: '3rem' },
        minWidth: 60,
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

          const editorUserId = item.task_editor_user_id || []
          const editorUser = groupMembers?.find(
            (memb) => memb.user_id === editorUserId
          )

          return (
            <Flex
              key={'editors_user_id'}
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Tooltip title={formatUserName(editorUser)} placement="top" arrow>
                <Flex alignItems="center" justifyContent="center">
                  <CAvatar user={editorUser} size={32} />
                </Flex>
              </Tooltip>
            </Flex>
          )
        },
      },
      ...(!isMinSmViewport
        ? []
        : [
            {
              hideable: false,
              sortable: false,
              field: 'group_id',
              key: 'group_id',
              headerName: 'Group',
              filterOperators: groupFilterOperators,
              minWidth: 32,
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
                  <Box height="100%" key={'group_id'}>
                    <Flex
                      alignItems="center"
                      justifyContent="center"
                      height="100%"
                    >
                      {item?.owner_group_id && userGroup && (
                        <Tooltip
                          title={userGroup?.group_name}
                          arrow
                          placement="top"
                        >
                          <Icon path={mdiAccountGroup} size={1} />
                        </Tooltip>
                      )}
                    </Flex>
                  </Box>
                )
              },
            },
          ]),

      {
        filterable: false,
        sortable: false,
        field: '_actions',
        key: '_actions',
        headerName: '',
        minWidth: 48,
        flex: 1,
        disableReorder: true,
        hideSortIcons: true,
        hideable: false,
        disableColumnMenu: true,
        // style: { width: '2rem' },
        header: '',
        renderCell: (cellProps) => {
          const item = cellProps?.row
          return (
            <Box
              height="100%"
              display="flex"
              alignItems="center"
              key="_actions"
              justifyContent="center"
            >
              <MoreActionsColumn
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
    deleteTask(item?.task_id)
    setUi((current) => ({
      ...current,
      openMenu: false,
      openDeleteConfirm: false,
    }))
  }, [item, deleteTask])
  return (
    <>
      <Box width="max-content">
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
