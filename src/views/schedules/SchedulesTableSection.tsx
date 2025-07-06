import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
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
  const actions = appController?.actions as AppControllerActions

  const theme = useTheme()
  const isMinSmViewport = useMediaQuery(theme.breakpoints.up('sm'))
  const isMinMdViewport = useMediaQuery(theme.breakpoints.up('md'))

  const [ui, setUi] = useState({
    scheduleModal: null as number | true | null,
    scheduleEntrysModal: null as number | null,
  })

  const handleOpenNewScheduleModal = useCallback(() => {
    setUi((prev) => ({ ...prev, scheduleModal: true }))
  }, [setUi])
  const handleOpenEditScheduleModal = useCallback(
    (schedule_id) => {
      setUi((prev) => ({ ...prev, scheduleModal: schedule_id }))
    },
    [setUi]
  )
  const handleCloseScheduleModal = useCallback(() => {
    setUi((prev) => ({ ...prev, scheduleModal: null }))
  }, [setUi])

  const handleOpenSchedulesEntrysModal = useCallback(
    (schedule_id: number) => {
      setUi((prev) => ({ ...prev, scheduleEntrysModal: schedule_id }))
    },
    [setUi]
  )
  const handleCloseScheduleEntrysModal = useCallback(() => {
    setUi((prev) => ({ ...prev, scheduleEntrysModal: null }))
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
            typeof ui.scheduleModal === 'number' ? ui.scheduleModal : undefined
          }
          data={data}
          open={!!ui.scheduleModal}
          onClose={handleCloseScheduleModal}
          onConfirm={handleConfirm}
        />
      )}
      {!!ui.scheduleEntrysModal && (
        <ScheduleEntrysCalendar
          schedule_id={
            typeof ui.scheduleEntrysModal === 'number'
              ? ui.scheduleEntrysModal
              : undefined
          }
          data={data}
          open={!!ui.scheduleEntrysModal}
          onClose={handleCloseScheduleEntrysModal}
          createOrEditScheduleEntry={actions.createOrEditScheduleEntry}
          deleteScheduleEntry={actions.deleteScheduleEntry}
        />
      )}
    </Box>
  )
}
