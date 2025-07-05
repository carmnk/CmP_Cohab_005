export type Task = {
  task_id: number
  task_name: string
  task_description: string
  task_editors_user_ids: number[]
  task_editor_user_id: number
  owner_user_id: number
  owner_group_id: number | null
  task_status: string
  due_datetime: string | null
  created_at: string
  parent_task_id: number | null
}
