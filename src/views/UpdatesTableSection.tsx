import { Box, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { dataChangesTableDef } from './tableDefs/dataChangesTableDef'
import { AppControllerData } from '../appController/types/appControllerData'
import { Flex } from '@cmk/fe_utils'
import { Task } from '../appController/types/tasks'

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

  const [expandedIds, setExpandedIds] = useState<string[]>([])
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
        <Box
          width="100%"
          minWidth={530}
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
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
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
      </Box>
    </Box>
  )
}
