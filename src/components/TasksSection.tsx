import { Box, Chip, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import { Button, Flex } from '@cmk/fe_utils'
import { mdiOpenInNew } from '@mdi/js'

export type TasksSectionProps = {
  data: any
}
declare const BASE_URL: string

export const TasksSection = (props: TasksSectionProps) => {
  const { data } = props
  const tasks = data?.tasks
  // const groupMembers = data?.user?.groups?.[0]?.group_members

  const navigateRaw = useNavigate()
  const navigate = useCallback(
    (to: string) => {
      const toAdj = to.startsWith('/') ? to.slice(1) : to
      const destination = BASE_URL + toAdj
      console.log('navigate', to, 'toAdj', toAdj, 'destination', destination)
      navigateRaw(destination)
    },
    [navigateRaw]
  )

  const privateTasks = useMemo(() => {
    return tasks.filter((task) => !task?.owner_group_id)
  }, [tasks])
  const groupTasks = useMemo(() => {
    return tasks.filter((task) => task?.owner_group_id)
  }, [tasks])

  return (
    <Box minHeight="8rem" mt="1rem">
      {/* <Typography variant="h6">Tasks</Typography> */}

      <Box display="grid" gridTemplateColumns="1fr 1fr 2rem" gap={2}>
        <Typography></Typography>
        <Typography>Open</Typography>
        <Typography></Typography>

        <Typography>My Personal Tasks ({privateTasks.length})</Typography>
        <Box>
          <Typography>
            open: (
            {privateTasks.filter((task) => task.task_status === 'open')?.length}
            )
          </Typography>
          <Typography>overdue: (?...)</Typography>
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
          <Typography>overdue: (?...)</Typography>
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
