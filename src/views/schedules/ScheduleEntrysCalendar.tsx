import { Flex } from '@cmk/fe_utils'
import { Box, Dialog, Typography } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { SchedulesCalendar } from '../../components/SchedulesCalendar/SchedulesCalendar'
import Icon from '@mdi/react'
import { mdiCalendar } from '@mdi/js'
import { AppControllerData } from '../../appController/types/appControllerData'
import { ScheduleEntry } from '../../appController/types/scheduleEntry'

export type Schedule = {
  schedule_id?: number
  schedule_name: string
  schedule_description: string

  period: string | null
  period_start: string | null
  is_recurring: boolean
  user_id: string | null
  group_id: string | null
}

export type ScheduleModalProps = {
  data: AppControllerData
  open: boolean
  onClose: () => void
  schedule_id?: number
  deleteScheduleEntry: (schedule_entry_id: number) => Promise<void>
  createOrEditScheduleEntry: (formData: ScheduleEntry) => void
}

export const ScheduleEntrysCalendar = (props: ScheduleModalProps) => {
  const {
    data,
    open,
    onClose,
    schedule_id,
    deleteScheduleEntry,
    createOrEditScheduleEntry,
  } = props
  // const groups = data?.user?.groups
  // const groupMembers = groups?.[0]?.group_members

  const existingSchedule =
    schedule_id &&
    data?.schedules?.find((sched) => sched.schedule_id === schedule_id)

  const scheduleEntrys = useMemo(() => {
    return (existingSchedule && existingSchedule?.schedule_entrys) || []
  }, [existingSchedule])

  return (
    <Dialog maxWidth="xl" open={open} onClose={onClose}>
      <Box p="2rem">
        <Flex alignItems="center" gap={'0.25rem'}>
          <Icon path={mdiCalendar} size={0.85} />
          <Typography variant="h6">
            {existingSchedule ? existingSchedule?.schedule_name : ''}
          </Typography>
        </Flex>
        <SchedulesCalendar
          data={data}
          scheduleEntrys={scheduleEntrys}
          schedule_id={schedule_id as any}
          onCreateOrEditScheduleEntry={createOrEditScheduleEntry}
          deleteScheduleEntry={deleteScheduleEntry}
        />
      </Box>
    </Dialog>
  )
}
