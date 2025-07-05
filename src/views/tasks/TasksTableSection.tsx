import { Box, Typography } from '@mui/material'
import { useEffect, useMemo, useRef } from 'react'
import { taskTableDef } from '../tableDefs/taskTableDef'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Flex } from '@cmk/fe_utils'
import { mdiPlus } from '@mdi/js'
import { AppControllerData } from '../../appController/types/appControllerData'
import { Task } from '../../appController/types/tasks'

export type TasksTableSectionProps = {
  data: AppControllerData
  openNewTaskModal?: () => void
  openTaskModal: (task_id: number) => void
  deleteTask: (task_id: number) => Promise<void>
  createOrEditTask: (task: Task) => Promise<void>
}

export const TasksTableSection = (props: TasksTableSectionProps) => {
  const {
    data,
    openTaskModal,
    deleteTask,
    createOrEditTask,
    openNewTaskModal,
  } = props

  const tableDef = useMemo(() => {
    return taskTableDef(data, openTaskModal, deleteTask, createOrEditTask)
  }, [data, createOrEditTask, deleteTask, openTaskModal])

  const apiRef = useRef(null)

  const itemsData = useMemo(() => {
    return data?.tasks?.filter?.((task) => !task?.parent_task_id) ?? []
  }, [data?.tasks])

  return (
    <Box mt={'1rem'} minHeight="8rem" overflow="auto">
      <Flex justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Tasks
        </Typography>
        <Button variant="outlined" icon={mdiPlus} onClick={openNewTaskModal}>
          Add Task
        </Button>
        {/* <Button
          variant="outlined"
          icon={mdiPlus}
          onClick={() => {
            apiRef?.current?.autosizeColumns?.()
          }}
        >
          RESIZE
        </Button> */}
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
        // mwxWidth="calc(100% - 180xpx9"
      >
        <Box
          width="100%"
          minWidth={530}
          height="100%"
          overflow="hidden"
          mt="1rem"
        >
          <DataGrid
            apiRef={apiRef}
            // autosizeOnMount
            autosizeOptions={{ expand: true }}
            rows={itemsData}
            getRowId={(row) => row.task_id}
            columns={tableDef?.columns as any}
            disableColumnSelector={true}
            // pageSizeOptions={[
            //   { value: 11, label: '11' },
            //   { value: 10, label: '10' },
            // ]}
            // pageSizeOptions={[4]}
            // paginationModel={{ pageSize: 6, page: 0 }}
          />
        </Box>
      </Box>
    </Box>
  )
}
