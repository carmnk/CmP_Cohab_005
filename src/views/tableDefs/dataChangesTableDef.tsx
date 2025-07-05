import { Button, Flex } from '@cmk/fe_utils'
import {
  mdiAccount,
  mdiAccountGroup,
  mdiArrowRight,
  mdiCheck,
  mdiChevronRight,
  mdiChevronUp,
  mdiDelete,
  mdiPencil,
  mdiPlus,
} from '@mdi/js'
import { Typography, Tooltip, Box, Stack } from '@mui/material'
import { formatUserName } from '../../utils/formatUsername'
import Icon from '@mdi/react'
import moment from 'moment'
import { AppControllerData } from '../../appController/types/appControllerData'
import { CAvatar } from '../../components/CAvatar'
import {
  AppControllerDataChanges,
  DataChange,
} from '../../appController/types/dataChanges'

export const dataChangesTableDef = (
  data: AppControllerData,
  dataChanges: AppControllerDataChanges,
  expandedIds: string[],
  toggleExpandedIds: (id: string) => void
) => {
  const groupMembers = data?.user?.groups?.[0]?.group_members ?? []

  const rows = dataChanges?.user_changes
    ?.map((item) => ({
      ...item,
      id: item?.user_change_id,
    }))
    .flat()

  console.log('ROWS', rows)

  return {
    data: rows, //[{ column1: "ABCD", column2: "EFGH" }],
    columns: [
      // {
      //   field: 'toggle_expand',
      //   sortable: false,
      //   filterable: false,
      //   disableColumnMenu: true,
      //   flex: 1,
      //   minWidth: 48,
      //   headerName: '',
      //   renderCell: (cellProps) => {
      //     const item = cellProps?.row

      //     return (
      //       <Flex height={'100%'} alignItems="center" justifyContent="center">
      //         {item?.user_change_id && !item?.data_change_id && (
      //           <Button
      //             variant="outlined"
      //             iconButton
      //             icon={
      //               expandedIds.includes(item?.user_change_id)
      //                 ? mdiChevronUp
      //                 : mdiChevronRight
      //             }
      //             onClick={() => toggleExpandedIds(item?.user_change_id)}
      //           />
      //         )}
      //       </Flex>
      //     )
      //   },
      // },
      {
        field: 'change_type',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        flex: 1,
        minWidth: 48,
        headerName: '',
        renderCell: (cellProps) => {
          const item = cellProps?.row

          return (
            <Flex height={'100%'} alignItems="center" justifyContent="center">
              {item?.user_change_id && !item?.data_change_id && (
                <Icon
                  path={
                    item?.data_change_id
                      ? mdiArrowRight
                      : item?.change_type === 'create'
                      ? mdiPlus
                      : item?.change_type === 'delete'
                      ? mdiDelete
                      : mdiPencil
                  }
                  size={0.7}
                />
              )}
            </Flex>
          )
        },
      },
      {
        headerName: 'User',
        field: 'user_id',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        minWidth: 72,
        flex: 1,
        headerAlign: 'center',
        renderHeader: () => (
          <Flex justifyContent="center" alignItems="center">
            <Tooltip title="user" placement="top" arrow>
              <Icon path={mdiAccount} size={1} />
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
              <Icon path={mdiAccountGroup} size={1} />
            </Tooltip>
          </Flex>
        ),
        renderCell: (cellProps) => {
          const item = cellProps?.row

          const editorUserIds = item.task_editors_user_ids || []
          const editorUsers = editorUserIds.map((eUserId) =>
            groupMembers?.find((memb) => memb.user_id === eUserId)
          )

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
        field: 'entity_name',
        sortable: false,
        flex: 1,
        minWidth: 48,
        headerName: '',
        renderCell: (cellProps) => {
          const item = cellProps?.row

          return (
            <Flex height={'100%'} alignItems="center" justifyContent="center">
              {item?.user_change_id && !item?.data_change_id && (
                <Typography>{item?.entity_name ?? '-'}</Typography>
              )}
            </Flex>
          )
        },
      },
      {
        field: 'field_name',
        sortable: false,
        flex: 1,

        minWidth: 120,
        headerName: 'Field Name',
        renderCell: (cellProps) => {
          const item = cellProps?.row
          const userChangeItem = item
          const userChangeItemId =
            !userChangeItem?.data_change_id && userChangeItem?.user_change_id
          const matchingDataChanges = dataChanges?.data_changes?.filter(
            (dc) => {
              return dc.user_change_id === userChangeItemId
            }
          )

          return (
            <Stack justifyContent={'center'} height="100%">
              {matchingDataChanges?.length ? (
                matchingDataChanges.map((dc) => (
                  <Typography
                    variant="body2"
                    textOverflow="ellipsis"
                    overflow={'hidden'}
                  >
                    {dc?.field_name ?? ''}
                  </Typography>
                ))
              ) : (
                <Typography
                  variant="body2"
                  textOverflow="ellipsis"
                  overflow={'hidden'}
                >
                  {item?.field_name ?? ''}
                </Typography>
              )}
            </Stack>
          )
        },
      },
      {
        field: 'old_value',
        sortable: false,
        flex: 1,

        minWidth: 140,
        headerName: 'Old Value',
        renderCell: (cellProps) => {
          const item = cellProps?.row
          const userChangeItem = item
          const userChangeItemId = userChangeItem?.user_change_id
          const matchingDataChanges = dataChanges?.data_changes?.filter(
            (dc) => {
              return dc.user_change_id === userChangeItemId
            }
          )

          return (
            <Stack justifyContent={'center'} height="100%">
              {matchingDataChanges?.length ? (
                matchingDataChanges?.map((dc, dIdx) => (
                  <Typography
                    key={dIdx}
                    variant="body2"
                    textOverflow="ellipsis"
                    overflow={'hidden'}
                    lineHeight={'1.25rem'}
                  >
                    {dc?.old_value ?? ''}
                  </Typography>
                ))
              ) : (
                <Typography
                  variant="body2"
                  textOverflow="ellipsis"
                  overflow={'hidden'}
                >
                  {item?.old_value ?? ''}
                </Typography>
              )}
            </Stack>
          )
        },
      },
      {
        field: 'new_value',
        sortable: false,
        flex: 1,

        minWidth: 140,
        headerName: 'New Value',
        renderCell: (cellProps) => {
          const item = cellProps?.row
          const userChangeItem = item
          const userChangeItemId =
            !userChangeItem?.data_change_id && userChangeItem?.user_change_id
          const matchingDataChanges = dataChanges?.data_changes?.filter(
            (dc) => {
              return dc.user_change_id === userChangeItemId
            }
          )
          console.log('item', item, userChangeItemId, matchingDataChanges)
          return (
            <Stack justifyContent={'center'} height="100%">
              {matchingDataChanges?.length ? (
                matchingDataChanges?.map((dc2, dIdx) => (
                  <Typography
                    key={dIdx}
                    variant="body2"
                    textOverflow="ellipsis"
                    overflow={'hidden'}
                    height="1.25rem"
                  >
                    {dc2?.new_value ?? ''}
                  </Typography>
                ))
              ) : (
                <Typography
                  variant="body2"
                  textOverflow="ellipsis"
                  overflow={'hidden'}
                >
                  {item?.new_value ?? ''}
                </Typography>
              )}
            </Stack>
          )
        },
      },

      {
        disableReorder: true,
        hideSortIcons: true,
        hideable: false,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        field: 'change_datetime',
        style: { width: '3rem' },
        minWidth: 140,
        flex: 1,
        headerName: 'time',
        headerAlign: 'center',
        renderCell: (cellProps) => {
          const item = cellProps?.row

          const editorUserIds = item.task_editors_user_ids || []
          const editorUsers = editorUserIds.map((eUserId) =>
            groupMembers?.find((memb) => memb.user_id === eUserId)
          )

          return (
            <Box height="100%">
              <Flex alignItems="center" justifyContent="center" height="100%">
                {item?.change_datetime &&
                  moment(item?.change_datetime)?.format('DD.MM.YYYY HH:mm')}
              </Flex>
            </Box>
          )
        },
      },
    ],
  }
}
