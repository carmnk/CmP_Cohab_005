import {
  Box,
  TablePagination,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  ChangeEvent,
  PointerEvent,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { dataChangesTableDef } from './tableDefs/dataChangesTableDef'
import { AppControllerData } from '../appController/types/appControllerData'
import { Flex } from '@cmk/fe_utils'
import { Task } from '../appController/types/tasks'
import { UpdatesSection } from './index/IndexUpdatesSection'

export type UpdatesTableSectionProps = {
  data: AppControllerData
  openNewTaskModal?: () => void
  openTaskModal: (task_id: number) => void
  deleteTask: (task_id: number) => Promise<void>
  createOrEditTask: (task: Task) => Promise<void>
  dataChanges: {
    user_changes: any[]
    data_changes: any[]
  }
}

export const UpdatesTableSection = (props: UpdatesTableSectionProps) => {
  const { data, dataChanges } = props

  const theme = useTheme()
  const isMinSmViewport = useMediaQuery(theme.breakpoints.up('sm'))
  const isMinMdViewport = useMediaQuery(theme.breakpoints.up('md'))
  const isMinLgViewport = useMediaQuery(theme.breakpoints.up('lg'))

  const [ui, setUi] = useState({
    page: 0,
    itemsPerPage: 10,
  })
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  const handleChangePage = useCallback((e: unknown, newPage: number) => {
    setUi((current) => ({ ...current, page: newPage }))
  }, [])
  const handleChangeItemsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newSize = event?.target?.value
      console.log('NERW SIZE ', newSize)
      setUi((current) => ({ ...current, itemsPerPage: parseInt(newSize) }))
    },
    []
  )
  const handleToggleExpandedId = useCallback(
    (id: string) => {
      setExpandedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    },
    [setExpandedIds]
  )

  const tableDef = useMemo(() => {
    return dataChangesTableDef(
      data,
      dataChanges,
      expandedIds,
      handleToggleExpandedId
    )
  }, [data, dataChanges, expandedIds, handleToggleExpandedId])

  return (
    <Box mt={'1rem'} minHeight="8rem">
      <Flex justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Updates
        </Typography>
      </Flex>
      <Box overflow="auto" width="100%" height="100%">
        {/* {isMinLgViewport ? (
          <Box
            width="100%"
            minWidth={675}
            height="100%"
            overflow="hidden"
            mt="1rem"
          >
            <DataGrid
              autosizeOnMount
              autosizeOptions={{ expand: true }}
              rows={tableDef?.data ?? []}
              getRowId={(row) => row?.id}
              columns={tableDef?.columns as any}
              disableColumnSelector={true}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              disableVirtualization
              getRowHeight={(gridRowParams) => {
                const userChangeItem = gridRowParams?.model
                const userChangeItemId = userChangeItem?.user_change_id
                const matchingDataChanges = dataChanges?.data_changes?.filter(
                  (dc) => {
                    return dc.user_change_id === userChangeItemId
                  }
                )
                console.log
                return Math.max(52, 20 * matchingDataChanges?.length + 2 * 4)
              }}
            />
          </Box>
        ) : ( */}
        <Box mt="1rem" maxWidth={600} mx="auto">
          <UpdatesSection
            data={data}
            dataChanges={dataChanges}
            start={ui.itemsPerPage * ui?.page}
            end={ui.itemsPerPage * (ui?.page + 1)}
          />
          <TablePagination
            sx={{ overflow: 'hidden' }}
            component="div"
            count={dataChanges?.user_changes?.length}
            page={ui.page}
            onPageChange={handleChangePage}
            rowsPerPage={ui?.itemsPerPage}
            rowsPerPageOptions={[10, 50, 100]}
            onRowsPerPageChange={handleChangeItemsPerPage}
          />
        </Box>
        {/* )} */}
      </Box>
    </Box>
  )
}
