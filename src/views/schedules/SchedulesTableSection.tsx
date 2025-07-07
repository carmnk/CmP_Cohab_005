import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Flex } from '@cmk/fe_utils'
import { mdiPlus } from '@mdi/js'
import { schedulesTableDef } from '../tableDefs/schedulesTableDef'
import { Schedule, ScheduleModal } from './ScheduleModal'
import { AppControllerData } from '../../appController/types/appControllerData'
import { ScheduleEntrysCalendar } from './ScheduleEntrysCalendar'
import { AppControllerActions } from '../../appController/useAppControllerActions'

export type SchedulesTableSectionProps = {
  data: AppControllerData
  appController: any
}

export const SchedulesTableSection = (props: SchedulesTableSectionProps) => {
  const { data, appController } = props
  const { setUi, ui } = appController
  const actions = appController?.actions as AppControllerActions

  const theme = useTheme()
  const isMinMdViewport = useMediaQuery(theme.breakpoints.up('md'))

  const handleOpenNewScheduleModal = useCallback(() => {
    setUi((current) => ({ ...current, scheduleModal: true }))
  }, [setUi])

  const handleOpenEditScheduleModal = useCallback(
    (schedule_id) => {
      setUi((current) => ({
        ...current,
        scheduleModal: schedule_id,
      }))
    },
    [setUi]
  )
  const handleCloseScheduleModal = useCallback(() => {
    setUi((current) => ({ ...current, scheduleModal: null }))
  }, [setUi])

  const handleOpenSchedulesEntrysModal = useCallback(
    (schedule_id: number) => {
      setUi((current) => ({
        ...current,
        scheduleEntryModal: schedule_id,
      }))
    },
    [setUi]
  )
  const handleClosescheduleEntryModal = useCallback(() => {
    setUi((current) => ({
      ...current,
      scheduleEntryModal: null,
    }))
  }, [setUi])

  const tableDef = useMemo(() => {
    return schedulesTableDef(
      data,
      handleOpenEditScheduleModal,
      actions.deleteSchedule,
      handleOpenSchedulesEntrysModal,
      isMinMdViewport
    )
  }, [
    data,
    actions.deleteSchedule,
    handleOpenEditScheduleModal,
    handleOpenSchedulesEntrysModal,
    isMinMdViewport,
  ])

  const handleConfirm = useCallback(
    async (schedule: Schedule) => {
      await actions.createOrEditSchedule(schedule as any)
      handleCloseScheduleModal()
    },
    [handleCloseScheduleModal, actions]
  )

  return (
    <Box mt={'1rem'} minHeight="8rem">
      <Flex justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Schedules
        </Typography>
        <Button
          variant="outlined"
          icon={mdiPlus}
          onClick={handleOpenNewScheduleModal}
        >
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
          minWidth={isMinMdViewport ? 530 : 0}
          height="100%"
          overflow="hidden"
          mt="1rem"
        >
          <DataGrid
            // autosizeOnMount
            autosizeOptions={{ expand: true }}
            rows={data?.schedules ?? []}
            getRowId={(row) => row.schedule_id}
            columns={tableDef?.columns as any}
            disableColumnSelector={true}
            pageSizeOptions={[10, 50, 100]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            getRowHeight={(gridRowParams) => {
              return isMinMdViewport ? 51 : 68
            }}
          />
        </Box>
      </Box>
      {!!ui.scheduleModal && (
        <ScheduleModal
          schedule_id={
            typeof ui?.scheduleModal === 'number' ? ui.scheduleModal : undefined
          }
          data={data}
          open={!!ui?.scheduleModal}
          onClose={handleCloseScheduleModal}
          onConfirm={handleConfirm}
        />
      )}
      {!!ui.scheduleEntryModal && (
        <ScheduleEntrysCalendar
          schedule_id={
            typeof ui.scheduleEntryModal === 'number'
              ? ui.scheduleEntryModal
              : undefined
          }
          data={data}
          open={!!ui.scheduleEntryModal}
          onClose={handleClosescheduleEntryModal}
          createOrEditScheduleEntry={actions.createOrEditScheduleEntry}
          deleteScheduleEntry={actions.deleteScheduleEntry}
        />
      )}
    </Box>
  )
}
