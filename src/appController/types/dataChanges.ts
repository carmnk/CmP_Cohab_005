export type DataChange = {
  data_change_id: number
  entity_name: string
  field_name: string
  new_value: string | null
  old_value: string | null
  path: null
  user_change_id: number
  change_datetime: string
}

export type UserChange = {
  change_datetime: string
  change_type: string
  entity_instance_id: number | null
  entity_name: string
  group_id: number | null
  user_change_id: number
  user_id: number
}

export type AppControllerDataChanges = {
  user_changes: UserChange[]
  data_changes: DataChange[]
}
