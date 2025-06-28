import { Box, Typography, useTheme } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

import { taskTableDef } from './tableDefs/taskTableDef'
import { Task } from './TaskModal'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Flex } from '@cmk/fe_utils'
import { mdiPlus } from '@mdi/js'
import { dataChangesTableDef } from './tableDefs/dataChangesTableDef'

export type UpdatesTableSectionProps = {
  data?: any
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
  const {
    data,
    dataChanges,
    openTaskModal,
    deleteTask,
    createOrEditTask,
    openNewTaskModal,
  } = props

  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const handleToggleExpandedId = useCallback(
    (id: string) => {
      setExpandedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    },
    [setExpandedIds]
  )
  const userGroup = data?.user?.groups?.[0]
  // const isGroupAdmin = userGroup?.group_admin_user_id === data?.user?.user_id

  const theme = useTheme()

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
      <Box
        // display="none"
        // position="fixed"
        // zIndex={10000000000}
        // top={0}
        // left={0}
        overflow="auto"
        width="100%"
        height="100%"
      >
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
          />
        </Box>
      </Box>
    </Box>
  )
}
