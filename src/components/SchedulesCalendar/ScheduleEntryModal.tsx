import { Button, CSelect2, Flex, Modal } from '@cmk/fe_utils'
import { Avatar, Box, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { AppControllerData } from '../../appController/types/appControllerData'
import { ScheduleEntry } from '../../appController/types/scheduleEntry'
import { CDateTimePicker } from '../DateTimePicker'
import moment, { Moment } from 'moment'
import { formatUserName } from '../../utils/formatUsername'
import { getUserInitials } from '../../utils/getUserInitials'
import { mdiDelete } from '@mdi/js'
import { CAvatar } from '../CAvatar'

const defaultScheduleEntryData = (
  user_id: number | null,
  group_id: number | null
) => ({
  schedule_entry_id: null,
  schedule_id: null,
  entry_start: null,
  entry_end: null,
  user_id: user_id ?? null,
  group_id: group_id ?? null,
  entry_user_id: user_id ?? null,
})

export type ScheduleEntryModalProps = {
  data: AppControllerData
  open: boolean
  onClose: () => void
  onConfirm: (formData: ScheduleEntry) => Promise<void>
  onDelete: (schedule_entry_id: number) => Promise<void>
  schedule_id: number
  schedule_entry_id?: number | null
  startTime?: string | null
}

export const ScheduleEntryModal = (props: ScheduleEntryModalProps) => {
  const {
    data,
    open,
    onClose,
    onConfirm,
    onDelete,
    schedule_entry_id,
    schedule_id,
    startTime,
  } = props
  const user = data?.user
  const groups = user?.groups
  const groupMembers = groups?.[0]?.group_members

  const schedule = useMemo(
    () => data?.schedules?.find((sched) => sched.schedule_id === schedule_id),
    [data?.schedules, schedule_id]
  )
  const existingScheduleEntry = useMemo(
    () =>
      schedule_entry_id &&
      schedule?.schedule_entrys?.find(
        (entry) => entry.schedule_entry_id === schedule_entry_id
      ),
    [schedule, schedule_entry_id]
  )

  const initialFormData = useMemo(
    () =>
      schedule_entry_id && existingScheduleEntry
        ? ({
            ...existingScheduleEntry,
            entry_start: moment(existingScheduleEntry?.entry_start),
            entry_end: moment(existingScheduleEntry?.entry_end),
          } as any)
        : defaultScheduleEntryData(
            user?.user_id ?? null,
            user?.group_id ?? null
          ),
    [schedule_entry_id, existingScheduleEntry, user]
  )

  const [formData, setFormData] = useState<ScheduleEntry>(
    startTime
      ? {
          ...initialFormData,
          entry_start: moment(startTime),
          entry_end: moment(startTime).add(1, 'h'),
        }
      : initialFormData
  )

  const handleSubmit = useCallback(async () => {
    const formDataAdj = { ...formData }
    if (formDataAdj?.entry_start) {
      formDataAdj.entry_start = moment(formDataAdj.entry_start).format(
        'YYYY-MM-DDTHH:mm:00.000Z'
      )
    }
    if (formDataAdj?.entry_end) {
      formDataAdj.entry_end = moment(formDataAdj.entry_end).format(
        'YYYY-MM-DDTHH:mm:00.000Z'
      )
    }
    const userId = data?.user?.user_id
    if (userId) {
      formDataAdj.user_id = userId
    }
    const groupId = data?.user?.group_id
    if (groupId) {
      formDataAdj.group_id = groupId
    }
    if (schedule_id) {
      formDataAdj.schedule_id = schedule_id
    }
    if (!formDataAdj?.schedule_entry_id && 'schedule_entry_id' in formDataAdj) {
      delete (formDataAdj as any).schedule_entry_id
    }

    await onConfirm?.(formDataAdj)
  }, [formData, onConfirm, data.user, schedule_id])

  const handleChange = useCallback((newValue: string, e: any) => {
    const name = e?.target?.name
    setFormData((current) => ({ ...current, [name]: newValue }))
  }, [])
  const handleChangeStartDate = useCallback((newValue: Moment) => {
    setFormData((current) => ({ ...current, entry_start: newValue as any }))
  }, [])
  const handleChangeEndDate = useCallback((newValue: Moment) => {
    setFormData((current) => ({ ...current, entry_end: newValue as any }))
  }, [])

  const groupMemberOptions = useMemo(() => {
    return [
      ...((groupMembers ?? [])
        ?.map?.((mem) => ({
          value: mem.user_id,
          label: formatUserName(mem),
        }))
        .filter(
          (member) =>
            formData?.group_id !== ('null' as any) ||
            member.value === data?.user?.user_id
        ) ?? []),
    ]
  }, [groupMembers, data?.user, formData?.group_id])

  const entryUser = useMemo(
    () =>
      formData.entry_user_id &&
      groupMembers?.find((member) => member.user_id === formData.entry_user_id),
    [formData.entry_user_id, groupMembers]
  )

  return (
    <Modal
      header={schedule_entry_id ? 'Edit Schedule Entry' : 'Add Schedule Entry'}
      open={open}
      width={640}
      isConfirmation
      onConfirm={handleSubmit}
      onClose={onClose}
      disableCloseOnConfirmation
    >
      {schedule_entry_id && (
        <Flex justifyContent="flex-end" position="relative" mt={'-1.25rem'}>
          <Button
            icon={mdiDelete}
            color="secondary"
            onClick={() => onDelete(schedule_entry_id)}
          >
            Delete Entry
          </Button>
        </Flex>
      )}
      <Box
        mt={'1rem'}
        display="grid"
        gridTemplateColumns="calc(50% - 0.5rem) calc(50% - 0.5rem)"
        alignItems="center"
        gap={'1rem'}
      >
        <Box>
          <Box>
            <Typography variant="caption">Start Datetime</Typography>
          </Box>
          <CDateTimePicker
            format="DD.MM.YYYY HH:mm"
            slotProps={{
              textField: {
                // name: 'entry_start',
                variant: 'outlined',
                size: 'small',
                slotProps: { input: { name: 'entry_start' } },
              },
            }}
            // name="entry_start"
            // label="Start Datetime"
            value={formData?.entry_start as any}
            onChange={handleChangeStartDate}
          />
        </Box>
        <Box>
          <Box>
            <Typography variant="caption">End Datetime</Typography>
          </Box>
          <CDateTimePicker
            format="DD.MM.YYYY HH:mm"
            slotProps={{
              textField: {
                // name: 'entry_end',
                variant: 'outlined',
                size: 'small',
                slotProps: { input: { name: 'entry_end' } },
              },
            }}
            // name="entry_end"
            // label="End Datetime"
            value={formData?.entry_end as any}
            onChange={handleChangeEndDate}
          />
        </Box>
      </Box>
      <Box
        mt={'1rem'}
        width={'calc(50% - 1rem)'}
        display="flex"
        alignItems="center"
        gap="1rem"
      >
        <CSelect2
          name="entry_user_id"
          label="User"
          value={(formData.entry_user_id as any) ?? ''}
          options={groupMemberOptions}
          size="small"
          onChange={handleChange}
        />
        {entryUser && <CAvatar size={32} user={entryUser} />}
      </Box>
    </Modal>
  )
}
