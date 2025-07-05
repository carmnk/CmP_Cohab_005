import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { Button } from '@cmk/fe_utils'
import { mdiOpenInNew } from '@mdi/js'
import { AppControllerData } from '../../appController/types/appControllerData'

export type TasksSectionProps = {
  data: AppControllerData
}

export const TasksSection = (props: TasksSectionProps) => {
  const { data } = props
  const tasks = data?.tasks

  const privateTasks = useMemo(() => {
    return tasks.filter((task) => !task?.owner_group_id)
  }, [tasks])
  const groupTasks = useMemo(() => {
    return tasks.filter((task) => task?.owner_group_id)
  }, [tasks])

  return (
    <Box minHeight="8rem" mt="1rem">
      {/* <Typography variant="h6">Tasks</Typography> */}

      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr 2rem"
        gap={'0.25rem 1rem'}
      >
        <Typography></Typography>
        <Typography fontWeight={500}>Open</Typography>
        <Typography></Typography>

        <Typography>My Personal Tasks ({privateTasks.length})</Typography>
        <Box>
          <Typography>
            open: (
            {privateTasks.filter((task) => task.task_status === 'open')?.length}
            )
          </Typography>
          {/* <Typography>overdue: (?...)</Typography> */}
        </Box>
        <Box>
          <Button
            variant="outlined"
            iconButton
            icon={mdiOpenInNew}
            disabled
            tooltip="*Coming Soon*"
          ></Button>
        </Box>

        <Typography>Group Tasks ({groupTasks.length})</Typography>
        <Box>
          <Typography>
            open: (
            {groupTasks.filter((task) => task.task_status === 'open')?.length})
          </Typography>
          {/* <Typography>overdue: (?...)</Typography> */}
        </Box>
        <Box>
          <Button
            variant="outlined"
            iconButton
            icon={mdiOpenInNew}
            disabled
            tooltip="*Coming Soon*"
          ></Button>
        </Box>
      </Box>
    </Box>
  )
}
