import { Box, Typography, useTheme } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

import { taskTableDef } from './tableDefs/taskTableDef'
import { Task } from './TaskModal'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Flex } from '@cmk/fe_utils'
import { mdiPlus } from '@mdi/js'

export type SchedulesTableSectionProps = {
  data?: any
  openNewTaskModal?: () => void
  openTaskModal: (task_id: number) => void
  deleteTask: (task_id: number) => Promise<void>
  createOrEditTask: (task: Task) => Promise<void>
}

export const SchedulesTableSection = (props: SchedulesTableSectionProps) => {
  const {
    data,
    openTaskModal,
    deleteTask,
    createOrEditTask,
    openNewTaskModal,
  } = props

  const userGroup = data?.user?.groups?.[0]
  // const isGroupAdmin = userGroup?.group_admin_user_id === data?.user?.user_id

  const theme = useTheme()

  const tableDef = useMemo(() => {
    return taskTableDef(data, openTaskModal, deleteTask, createOrEditTask)
  }, [data, createOrEditTask, deleteTask, openTaskModal])

  return (
    <Box mt={'1rem'} minHeight="8rem">
      <Flex justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Schedules
        </Typography>
        <Button variant="outlined" icon={mdiPlus} onClick={openNewTaskModal}>
          Add Schedule
        </Button>
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
            rows={data?.schedules ?? []}
            getRowId={(row) => row.task_id}
            columns={tableDef?.columns as any}
            disableColumnSelector={true}
          />
        </Box>
      </Box>
    </Box>
  )
}
