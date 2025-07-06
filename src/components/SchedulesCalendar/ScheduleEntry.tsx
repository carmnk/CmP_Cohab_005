import { Button, Flex } from '@cmk/fe_utils'
import { mdiPencil, mdiPlus } from '@mdi/js'
import Icon from '@mdi/react'
import { Typography, useMediaQuery, useTheme } from '@mui/material'
import moment from 'moment'
import { useCallback, useMemo } from 'react'
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
  const isMinMdViewport = useMediaQuery(theme.breakpoints.up('md'))
  const groups = data?.user?.groups
  const groupMembers = groups?.[0]?.group_members

  const startTime = useMemo(() => moment(date), [date])
  const endTime = useMemo(() => moment(startTime).add(1, 'hour'), [startTime])

  const scheduleEntry = useMemo(
    () =>
      scheduleEntrys.find((entry) => {
        return (
          moment(entry.entry_start).isBefore(endTime) &&
          moment(entry.entry_end).isAfter(startTime)
        )
      }),
    [scheduleEntrys, endTime, startTime]
  )
  const scheduleUser = useMemo(
    () =>
      groupMembers?.find(
        (user) => user?.user_id === scheduleEntry?.entry_user_id
      ),
    [groupMembers, scheduleEntry]
  )

  const handleOpenNewScheduleEntryModal = useCallback(() => {
    if (scheduleEntry) return
    onOpenNew(date)
  }, [onOpenNew, scheduleEntry, date])

  return (
    <Flex
      border="1px solid #666"
      textAlign="center"
      justifyContent="center"
      borderBottom={0}
      width="100%"
      height="100%"
      position="relative"
      bgcolor={
        scheduleEntry
          ? scheduleUser?.user_color
          : rowIndex % 2 === 0
          ? '#f9f9f9'
          : '#fff'
      }
      sx={{
        cursor: scheduleUser ? undefined : 'pointer',
        '&:hover': {
          bgcolor: 'primary.dark',
        },
      }}
      onClick={handleOpenNewScheduleEntryModal}
    >
      {scheduleEntry ? (
        <>
          <Flex gap={'0.25rem'} display={isMinMdViewport ? undefined : 'block'}>
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
