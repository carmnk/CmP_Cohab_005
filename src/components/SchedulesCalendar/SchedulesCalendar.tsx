import { Box, Typography } from '@mui/material'
import moment from 'moment'
import { Fragment } from 'react/jsx-runtime'
import { ScheduleEntryField } from './ScheduleEntry'
import { ScheduleEntry } from '../../appController/types/scheduleEntry'
import { AppControllerData } from '../../appController/types/appControllerData'
import { ScheduleEntryModal } from './ScheduleEntryModal'
import { useCallback, useState } from 'react'
import { formatMonthIndex } from './formatMonthIndex'
import { Button, Flex, NumberField } from '@cmk/fe_utils'
import {
  mdiCalendarCollapseHorizontal,
  mdiChevronLeft,
  mdiChevronRight,
} from '@mdi/js'

const basicHeaderSx = {
  border: '1px solid #666',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const columnHeaderSx = {
  border: '1px solid #666',
  borderLeft: 0,
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: '#f0f0f0',
}

export type SchedulesCalendarProps = {
  data: AppControllerData
  scheduleEntrys: ScheduleEntry[]
  schedule_id: number
  onCreateOrEditScheduleEntry: (formData: ScheduleEntry) => void
  deleteScheduleEntry: (schedule_entry_id: number) => Promise<void>
}

export const SchedulesCalendar = (props: SchedulesCalendarProps) => {
  const {
    data,
    scheduleEntrys = [],
    schedule_id,
    onCreateOrEditScheduleEntry,
    deleteScheduleEntry,
  } = props

  const currentWeek = moment().isoWeek()

  const [ui, setUi] = useState({
    week: currentWeek,
    year: 2025,
    entryModal: null as
      | { schedule_entry_id: number }
      | { startTime: string }
      | null,
  })

  const handleIncreaseWeek = useCallback(() => {
    const lastDaysWeek = moment({ year: ui.year, day: 31, month: 11 }).isoWeek()
    const lastDayWeekMinus1Week = moment(lastDaysWeek)
      .subtract(1, 'week')
      .isoWeek()
    const maxWeek = Math.max(lastDaysWeek, lastDayWeekMinus1Week)
    setUi((current) => ({
      ...current,
      week: Math.min(current.week + 1, maxWeek),
    }))
  }, [ui.year])

  const handleDecreaseWeek = useCallback(() => {
    setUi((current) => ({
      ...current,
      week: Math.max(current.week - 1, 1),
    }))
  }, [])

  const handleResetWeek = useCallback(() => {
    setUi((current) => ({
      ...current,
      week: currentWeek,
    }))
  }, [currentWeek])

  const handleCloseEntryModal = useCallback(() => {
    setUi((current) => ({ ...current, entryModal: null }))
  }, [])

  const handleOpenNewEntry = useCallback((newTime: string) => {
    setUi((current) => ({
      ...current,
      entryModal: { startTime: moment(newTime) as any },
    }))
  }, [])
  const handleOpenEditEntry = useCallback((schedule_entry_id: number) => {
    setUi((current) => ({
      ...current,
      entryModal: { schedule_entry_id },
    }))
  }, [])

  const weekStartDate = moment().week(ui.week).day('Monday').set({
    // w: week,
    // day: 1,
    h: 0,
    m: 0,
    s: 0,
    ms: 0,
  })
  const tuesday = moment(weekStartDate).add(1, 'day')
  const wednesday = moment(weekStartDate).add(2, 'd')
  const thursday = moment(weekStartDate).add(3, 'd')
  const friday = moment(weekStartDate).add(4, 'd')
  const saturday = moment(weekStartDate).add(5, 'd')
  const sunday = moment(weekStartDate).add(6, 'd')

  const calendarWeekDaysMonth = [
    weekStartDate,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  ].map((day) => day.month())
  const valuesOccured = {}
  calendarWeekDaysMonth.forEach((week) => {
    valuesOccured[week] = (valuesOccured?.[week] ?? 0) + 1
  })
  const occuredMonths = Object.keys(valuesOccured).map((val) => parseInt(val))
  const month =
    valuesOccured[occuredMonths[0]] > (valuesOccured?.[occuredMonths?.[1]] ?? 0)
      ? occuredMonths[0]
      : occuredMonths[1]
  const monthStr = formatMonthIndex(month)

  const year = weekStartDate.year()

  const handleDeleteScheduleEntry = useCallback(
    async (schedule_entry_id: number) => {
      await deleteScheduleEntry(schedule_entry_id)
      setUi((current) => ({ ...current, entryModal: null }))
    },
    [deleteScheduleEntry]
  )

  return (
    <Box>
      <Flex alignItems="center" gap="1rem" mt="0.25rem">
        <Typography>
          {monthStr} {year}
        </Typography>
        <Flex alignItems="center" gap="0.5rem">
          <Typography>Week:</Typography>
          <Button
            variant="outlined"
            iconButton
            icon={mdiChevronLeft}
            onClick={handleDecreaseWeek}
          />
          <Box width={40}>
            <NumberField
              disableLabel
              disableHelperText
              size="small"
              value={ui.week}
              slotProps={{
                input: { sx: { textAlign: 'center', p: '0.325rem' } },
              }}
            />
          </Box>
          <Button
            variant="outlined"
            iconButton
            icon={mdiChevronRight}
            onClick={handleIncreaseWeek}
          />
        </Flex>
        <Button
          variant="outlined"
          iconButton
          iconSize={24}
          icon={mdiCalendarCollapseHorizontal}
          disabled={ui.week === currentWeek}
          tooltip={
            ui.week === currentWeek
              ? 'The current week is displayed'
              : 'Reset To current Week'
          }
          onClick={handleResetWeek}
        />
      </Flex>

      <Box maxHeight={500} overflow={'auto'} pr={'1rem'}>
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
          gridTemplateRows="repeat(1, 60px)"
          mt={1}
        >
          <Box sx={basicHeaderSx}></Box>
          <Box sx={columnHeaderSx}>
            <Box>
              <Typography>Monday</Typography>
              <Typography variant="body2">
                {weekStartDate.format('DD.MM')}
              </Typography>
            </Box>
          </Box>
          <Box sx={columnHeaderSx}>
            <Box>
              <Typography>Tuesday</Typography>
              <Typography variant="body2">{tuesday.format('DD.MM')}</Typography>
            </Box>
          </Box>
          <Box sx={columnHeaderSx}>
            <Box>
              <Typography>Wednesday</Typography>
              <Typography variant="body2">
                {wednesday.format('DD.MM')}
              </Typography>
            </Box>
          </Box>
          <Box sx={columnHeaderSx}>
            <Box>
              <Typography>Thursday</Typography>
              <Typography variant="body2">
                {thursday.format('DD.MM')}
              </Typography>
            </Box>
          </Box>
          <Box sx={columnHeaderSx}>
            <Box>
              <Typography>Friday</Typography>
              <Typography variant="body2">{friday.format('DD.MM')}</Typography>
            </Box>
          </Box>
          <Box sx={columnHeaderSx}>
            <Box>
              <Typography>Saturday</Typography>
              <Typography variant="body2">
                {saturday.format('DD.MM')}
              </Typography>
            </Box>
          </Box>
          <Box sx={columnHeaderSx}>
            <Box>
              <Typography>Sunday</Typography>
              <Typography variant="body2">{sunday.format('DD.MM')}</Typography>
            </Box>
          </Box>
        </Box>
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
          gridTemplateRows="repeat(24, 60px)"
        >
          {new Array(24).fill(null).map((_, index) => {
            const hour = Math.floor(index)
            const row = index

            const timeLabel = moment()
              .startOf('day')
              .add(hour, 'hours')
              .format('HH:mm')

            const mondayDate = moment(weekStartDate)
              .add({ hour: row })
              .format('YYYY-MM-DD HH:mm')
            const tuesdayDate = moment(weekStartDate)
              .add({ hour: row, day: 1 })
              .format('YYYY-MM-DD HH:mm')
            const wednesdayDate = moment(weekStartDate)
              .add({ hour: row, day: 2 })
              .format('YYYY-MM-DD HH:mm')
            const thursdayDate = moment(weekStartDate)
              .add({ hour: row, day: 3 })
              .format('YYYY-MM-DD HH:mm')
            const fridayDate = moment(weekStartDate)
              .add({ hour: row, day: 4 })
              .format('YYYY-MM-DD HH:mm')
            const saturdayDate = moment(weekStartDate)
              .add({ hour: row, day: 5 })
              .format('YYYY-MM-DD HH:mm')
            const sundayDate = moment(weekStartDate)
              .add({ hour: row, day: 6 })
              .format('YYYY-MM-DD HH:mm')

            return (
              <Fragment key={index}>
                <Box
                  border="1px solid #666"
                  textAlign="center"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  width="100%"
                  bgcolor={index % 2 === 0 ? '#f9f9f9' : '#fff'}
                  position="relative"
                >
                  <Typography variant="caption" color="textSecondary">
                    {timeLabel}
                  </Typography>
                </Box>

                <ScheduleEntryField
                  date={mondayDate}
                  scheduleEntrys={scheduleEntrys}
                  data={data}
                  rowIndex={index}
                  onOpenNew={handleOpenNewEntry}
                  onOpenEdit={handleOpenEditEntry}
                />
                <ScheduleEntryField
                  date={tuesdayDate}
                  data={data}
                  scheduleEntrys={scheduleEntrys}
                  rowIndex={index}
                  onOpenNew={handleOpenNewEntry}
                  onOpenEdit={handleOpenEditEntry}
                />
                <ScheduleEntryField
                  date={wednesdayDate}
                  scheduleEntrys={scheduleEntrys}
                  rowIndex={index}
                  data={data}
                  onOpenNew={handleOpenNewEntry}
                  onOpenEdit={handleOpenEditEntry}
                />
                <ScheduleEntryField
                  date={thursdayDate}
                  scheduleEntrys={scheduleEntrys}
                  data={data}
                  rowIndex={index}
                  onOpenNew={handleOpenNewEntry}
                  onOpenEdit={handleOpenEditEntry}
                />
                <ScheduleEntryField
                  date={fridayDate}
                  scheduleEntrys={scheduleEntrys}
                  data={data}
                  rowIndex={index}
                  onOpenNew={handleOpenNewEntry}
                  onOpenEdit={handleOpenEditEntry}
                />
                <ScheduleEntryField
                  date={saturdayDate}
                  scheduleEntrys={scheduleEntrys}
                  data={data}
                  rowIndex={index}
                  onOpenNew={handleOpenNewEntry}
                  onOpenEdit={handleOpenEditEntry}
                />
                <ScheduleEntryField
                  date={sundayDate}
                  scheduleEntrys={scheduleEntrys}
                  data={data}
                  rowIndex={index}
                  onOpenNew={handleOpenNewEntry}
                  onOpenEdit={handleOpenEditEntry}
                />
              </Fragment>
            )
          })}
        </Box>
      </Box>
      {ui.entryModal && (
        <ScheduleEntryModal
          schedule_id={schedule_id}
          schedule_entry_id={
            'schedule_entry_id' in ui.entryModal
              ? ui.entryModal.schedule_entry_id
              : null
          }
          data={data}
          open={!!ui.entryModal}
          onClose={handleCloseEntryModal}
          onConfirm={async (schedEntry) => {
            console.log(schedEntry)
            onCreateOrEditScheduleEntry?.(schedEntry)
            handleCloseEntryModal()
          }}
          onDelete={handleDeleteScheduleEntry}
          startTime={
            'startTime' in ui.entryModal ? ui.entryModal.startTime : null
          }
        />
      )}
    </Box>
  )
}
