import { Typography } from '@mui/material'

export type TasksSectionProps = {
  data: any
}
declare const BASE_URL: string

export const SchedulesSection = (props: TasksSectionProps) => {
  const { data } = props

  return (
    <Typography>*COMING SOON* </Typography>
    // <Box minHeight="8rem" mt="1rem">
    //   {/* <Typography variant="h6">Tasks</Typography> */}

    //   <Flex gap={2}>
    //     <Typography>My Personal Tasks ({privateTasks.length})</Typography>
    //     <Box>
    //       <Typography>
    //         open: (
    //         {privateTasks.filter((task) => task.task_status === "open")?.length}
    //         )
    //       </Typography>
    //       <Typography>overdue: ( COMING SOON* )</Typography>
    //     </Box>
    //   </Flex>
    //   <Flex gap={2}>
    //     <Typography>Group Tasks ({groupTasks.length})</Typography>
    //     <Box>
    //       <Typography>
    //         open: (
    //         {groupTasks.filter((task) => task.task_status === "open")?.length})
    //       </Typography>
    //       <Typography>overdue: ( COMING SOON* )</Typography>
    //     </Box>
    //   </Flex>
    // </Box>
  )
}
