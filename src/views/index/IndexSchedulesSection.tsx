import { Box, Typography } from '@mui/material'
import { AppControllerData } from '../../appController/types/appControllerData'
import moment from 'moment'
import { useMemo } from 'react'

export type TasksSectionProps = {
  data: AppControllerData
}
declare const BASE_URL: string

export const SchedulesSection = (props: TasksSectionProps) => {
  const { data } = props

  const allScheduleEntrys = useMemo(
    () =>
      data?.schedules
        ?.map((sched) => sched?.schedule_entrys)
        .flat()
        .filter(
          (sched) =>
            !!sched.entry_start &&
            moment(sched.entry_start).isValid() &&
            moment(sched.entry_start).isSameOrAfter(
              moment().set({ hour: 0, minute: 0, second: 0, ms: 0 })
            )
        )
        ?.sort((a, b) =>
          moment(a?.entry_start).isAfter(moment(b?.entry_start))
            ? 1
            : moment(a?.entry_start).isBefore(moment(b?.entry_start))
            ? -1
            : 0
        )
        .reverse(),
    [data?.schedules]
  )

  return allScheduleEntrys?.length ? (
    <Typography>
      Your next schedule is set for{' '}
      <Box component="span" fontWeight={600}>
        {moment(allScheduleEntrys?.[0]?.entry_start).format('DD.MM.YYYY HH:mm')}
      </Box>
    </Typography>
  ) : (
    <Typography>
      You have no upcoming schedule entrys 
      
    </Typography>
  )
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
}
