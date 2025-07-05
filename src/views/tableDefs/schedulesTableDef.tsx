import { AlertDialog, Button, Flex } from '@cmk/fe_utils'
import {
  mdiAccountGroup,
  mdiCheck,
  mdiDelete,
  mdiDotsVertical,
  mdiOpenInApp,
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
  Box,
} from '@mui/material'
import { formatUserName } from '../../utils/formatUsername'
import { useCallback, useRef, useState } from 'react'
import Icon from '@mdi/react'
import { getUserInitials } from '../../utils/getUserInitials'
import { GridFilterOperator } from '@mui/x-data-grid'
import { AppControllerData } from '../../appController/types/appControllerData'
import { CAvatar } from '../../components/CAvatar'

export const schedulesTableDef = (
  data: AppControllerData,
  openScheduleModal: (schedule_id: number | true | null) => void,
  deleteSchedule: (schedule_id: number) => void,
  openSchedulesEntrysModal: (schedule_id: number) => void
) => {
  const groupMembers = data?.user?.groups?.[0]?.group_members ?? []

  const groupFilterOperators: GridFilterOperator[] = [
    {
      label: 'Your Private Tasks',
      value: 'null',
      getApplyFilterFn: (filterItem, column) => {
        if (!filterItem.field || !filterItem.operator) {
          return null
        }
        return (value, row, column, apiRef) => {
          return row?.group_id === null
        }
      },
    },
    ...(data?.user?.groups?.map((group) => ({
      label: group.group_name ?? 'Your Group (unnamed)',
      value: group.group_id as any,
      getApplyFilterFn: (filterItem, column) => {
        if (!filterItem.field || !filterItem.operator) {
          return null
        }
        return (value, row, column, apiRef) => {
          return row?.group_id === filterItem.operator
        }
      },
    })) ?? []),
  ]

  return {
    data: data?.schedules, //[{ column1: "ABCD", column2: "EFGH" }],
    columns: [
      {
        field: 'schedule_name',
        flex: 8,
        headerName: 'Name',
        renderCell: (cellProps) => {
          const item = cellProps?.row

          return (
            <Box>
              <Typography textOverflow={'ellipsis'} overflow={'hidden'}>
                {item?.schedule_name ?? ''}
              </Typography>

              {item?.schedule_description && (
                <Typography
                  variant="body2"
                  textOverflow={'ellipsis'}
                  overflow={'hidden'}
                >
                  {item?.schedule_description ?? ''}
                </Typography>
              )}
            </Box>
          )
        },
      },
      {
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
            <Tooltip title="Schedule creator" placement="top" arrow>
              <Icon path={mdiPlus} size={1} />
            </Tooltip>
          </Flex>
        ),
        renderCell: (cellProps) => {
          const item = cellProps?.row

          const creatorUser = groupMembers?.find?.(
            (memb) => memb.user_id === item?.user_id
          )
          return (
            <Box height="100%">
              <Flex alignItems="center" justifyContent="center" height="100%">
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
      {
        hideable: false,
        sortable: false,
        field: 'group_id',
        headerName: 'Group',
        filterOperators: groupFilterOperators,
        minWidth: 85,
        flex: 1,
        header: (
          <Flex justifyContent="center" alignItems="center">
            <Tooltip title="Schedule editors" placement="top" arrow>
              <Icon path={mdiAccountGroup} size={1} />
            </Tooltip>
          </Flex>
        ),
        renderCell: (cellProps) => {
          const item = cellProps?.row

          return (
            <Box height="100%">
              <Flex alignItems="center" justifyContent="center" height="100%">
                {item?.group_id && <Icon path={mdiCheck} size={1} />}
              </Flex>
            </Box>
          )
        },
      },

      {
        filterable: false,
        sortable: false,
        field: '_actions',
        headerName: '',
        minWidth: 96,
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
            <Box height="100%" display="flex" alignItems="center" gap="0.5rem">
              <Button
                iconButton
                icon={mdiOpenInApp}
                tooltip="Open Schedule"
                onClick={() => {
                  openSchedulesEntrysModal(item?.schedule_id)
                }}
              />
              <MoreActionsColumn
                // index={rIdx}
                item={item}
                openScheduleModal={openScheduleModal}
                deleteSchedule={deleteSchedule}
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
  openScheduleModal: (schedule_id: number) => void
  deleteSchedule: (schedule_id: number) => void
}

const MoreActionsColumn = (props: MoreActionsColumnProps) => {
  const { item, openScheduleModal, deleteSchedule } = props
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
    openScheduleModal?.(item?.schedule_id)
    setUi((current) => ({ ...current, openMenu: false }))
  }, [openScheduleModal, item])
  const handleDeleteItem = useCallback(() => {
    handleToggleOpenConfirmDelete()
    setUi((current) => ({ ...current, openMenu: false }))
  }, [handleToggleOpenConfirmDelete])

  const handleConfirmedDelete = useCallback(() => {
    deleteSchedule(item?.schedule_id)
    setUi((current) => ({
      ...current,
      openMenu: false,
      openDeleteConfirm: false,
    }))
  }, [item, deleteSchedule])

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
          <ListItemText>Edit Schedule</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteItem}>
          <ListItemIcon>
            <Icon path={mdiDelete} size={1} color={theme.palette.error.light} />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.light' }}>
            Delete Schedule
          </ListItemText>
        </MenuItem>
      </Menu>
      <AlertDialog
        disableCloseOnConfirmation
        {...alertProps}
        width={320}
        minWidth={320}
        header="Please confirm to delete this schedule"
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
