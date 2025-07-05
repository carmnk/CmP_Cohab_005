import { CSelect2, CTextField, Modal } from '@cmk/fe_utils'
import { Box } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { AppControllerData } from '../../appController/types/appControllerData'

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
const defaultScheduleData: Schedule = {
  schedule_name: '',
  schedule_description: '',
  user_id: 'null',
  group_id: 'null',
  period: null,
  period_start: null,
  is_recurring: false,
}

export type ScheduleModalProps = {
  data: AppControllerData
  open: boolean
  onClose: () => void
  onConfirm: (formData: Schedule) => Promise<void>
  schedule_id?: number
}

const formatFormData = (formDataIn: any) => ({
  ...formDataIn,
  group_id: formDataIn.group_id === 'null' ? null : formDataIn.group_id,
  user_id: formDataIn.user_id === 'null' ? null : formDataIn.user_id,
  // due_datetime:
  //   formDataIn.formDataIn !== null ? moment(formDataIn.formDataIn : null,
})
const validateFormData = (formData: Schedule) => {
  if (['schedule_name', 'user_id'].find((fieldName) => !formData[fieldName])) {
    return false
  }
  // if (
  //   formData?.due_datetime !== null &&
  //   !moment(formData?.due_datetime).isValid()
  // )
  //   return false
  return true
}

export const ScheduleModal = (props: ScheduleModalProps) => {
  const { data, open, onClose, onConfirm, schedule_id } = props
  const groups = data?.user?.groups
  const groupMembers = groups?.[0]?.group_members

  const existingSchedule =
    schedule_id &&
    data?.schedules?.find((sched) => sched.schedule_id === schedule_id)
  const { schedule_entrys: _s, ...adjustedExistingSchedule1 } =
    existingSchedule || {}

  const adjustedExistingSchedule = existingSchedule
    ? (adjustedExistingSchedule1 as Schedule)
    : null

  const initialFormData =
    schedule_id && existingSchedule && adjustedExistingSchedule
      ? adjustedExistingSchedule
      : defaultScheduleData
  const [formData, setFormData] = useState<Schedule>(initialFormData)

  const ownerGroupsOptions = useMemo(() => {
    return [
      { value: 'null', label: 'Only You' },
      ...(groups?.map?.((gr) => ({
        value: gr.group_id,
        label: gr.group_name || 'Your Group (unnamed)',
      })) ?? []),
    ]
  }, [groups])

  const handleSubmit = useCallback(async () => {
    const formDataAdj = formatFormData(formData)
    if (!schedule_id) {
      formDataAdj.user_id = data?.user?.user_id
    }
    if (!validateFormData(formDataAdj)) {
      alert('Formdata incomplete')
      return
    }
    if (formDataAdj?.due_datetime) {
      formDataAdj.due_datetime = new Date(
        formDataAdj?.due_datetime
      ).toISOString()
    }

    console.log('submit', formData, formDataAdj)
    await onConfirm?.(formDataAdj)
  }, [formData, onConfirm, data?.user, schedule_id])

  const handleChange = useCallback((newValue: string, e: any) => {
    const name = e?.target?.name
    setFormData((current) => ({ ...current, [name]: newValue }))
  }, [])

  return (
    <Modal
      header={schedule_id ? 'Edit Schedule' : 'Add Schedule'}
      open={open}
      width={640}
      isConfirmation
      onConfirm={handleSubmit}
      onClose={onClose}
      disableCloseOnConfirmation
    >
      <Box>
        <CTextField
          name="schedule_name"
          label="Schedule Name"
          value={formData.schedule_name}
          size="small"
          onChange={handleChange}
        />
        <CTextField
          name="schedule_description"
          label="Schedule Description"
          value={formData.schedule_description}
          multiline
          minRows={3}
          size="small"
          onChange={handleChange}
        />
        {formData?.schedule_id && (
          <CTextField
            label="user_id"
            disabled
            value={formData?.user_id as any}
            size="small"
            onChange={handleChange}
          />
        )}
        <Box display="grid" gridTemplateColumns={'1fr 1fr'} gap={2}>
          <CSelect2
            name="group_id"
            label="Group"
            value={formData.group_id ?? ''}
            options={ownerGroupsOptions}
            size="small"
            onChange={handleChange}
          />
        </Box>
      </Box>
    </Modal>
  )
}
