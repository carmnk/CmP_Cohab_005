import * as React from 'react'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  DateTimePicker,
  DateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker'

export type CDateTimePickerProps = DateTimePickerProps<any> & {
  label: string
}

export const CDateTimePicker = (props: CDateTimePickerProps) => {
  const { label, ...rest } = props
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateTimePicker label={label} {...rest} />
    </LocalizationProvider>
  )
}
