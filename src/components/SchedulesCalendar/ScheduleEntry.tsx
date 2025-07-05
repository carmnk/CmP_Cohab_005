import { Button, Flex } from '@cmk/fe_utils'
import { mdiPencil, mdiPlus } from '@mdi/js'
import Icon from '@mdi/react'
import { Typography, useTheme } from '@mui/material'
import moment from 'moment'
import { useMemo } from 'react'
import { ScheduleEntry } from '../../appController/types/scheduleEntry'
import { AppControllerData } from '../../appController/types/appControllerData'
import { formatUserName } from '../../utils/formatUsername'

export type ScheduleEntryProps = {
  scheduleEntrys: ScheduleEntry[]
  date: string
  data: AppControllerData
  rowIndex: number
  onOpenNew: (newTime: string) => void
  onOpenEdit: (schedule_entry_id: number) => void
}

export const ScheduleEntryField = (props: ScheduleEntryProps) => {
  const { scheduleEntrys, date, data, rowIndex, onOpenNew, onOpenEdit } = props

  const theme = useTheme()
  const groups = data?.user?.groups
  const groupMembers = groups?.[0]?.group_members

  const startTime = useMemo(() => moment(date), [date])
  const endTime = useMemo(() => moment(startTime).add(1, 'hour'), [startTime])

  const scheduleEntry = scheduleEntrys.find((entry) => {
    return (
      moment(entry.entry_start).isBefore(endTime) &&
      moment(entry.entry_end).isAfter(startTime)
    )
  })
  const scheduleUser = groupMembers?.find(
    (user) => user?.user_id === scheduleEntry?.entry_user_id
  )

  if (scheduleEntry) console.log('scheduleEntry', scheduleEntry, startTime)

  return (
    <Flex
      sx={{
        border: '1px solid #666',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: 0,
        width: '100%',
        height: '100%',
        position: 'relative',
        bgcolor: scheduleEntry
          ? scheduleUser?.user_color
          : rowIndex % 2 === 0
          ? '#f9f9f9'
          : '#fff',
        cursor: scheduleUser ? undefined : 'pointer',
        '&:hover': {
          bgcolor: 'primary.dark',
        },
      }}
      onClick={() => {
        if (scheduleEntry) return
        onOpenNew(date)
        // alert('clicked entry with time ' + date)
      }}
    >
      {scheduleEntry ? (
        <>
          <Flex gap={'0.25rem'}>
            <Typography alignItems="center" textAlign="center" width={'100%'}>
              {scheduleUser?.user_name ?? scheduleUser
                ? formatUserName(scheduleUser)
                : ''}
            </Typography>
            <Button
              variant="outlined"
              iconButton
              size="small"
              icon={mdiPencil}
              sx={{ bgcolor: '#ddd', width: 48 }}
              onClick={() => {
                // alert('clicked OCCUPIED entry with time ' + date)
                onOpenEdit(scheduleEntry.schedule_entry_id)
              }}
            />
          </Flex>
        </>
      ) : (
        <Icon path={mdiPlus} size={0.8} color={theme.palette.primary.main} />
      )}
    </Flex>
  )
}
