import { Flex, CTextField, Button } from '@cmk/fe_utils'
import { mdiPlus, mdiCheck } from '@mdi/js'
import Icon from '@mdi/react'
import { KeyboardEvent, useCallback, useState } from 'react'

export type AddTaskTreeItemProps = {
  parent_task_id: number | null
  onSubmitNewTask: (task_name: string, parent_task_id: number | null) => void
}

export const AddTaskTreeItem = (props: AddTaskTreeItemProps) => {
  const { parent_task_id, onSubmitNewTask } = props
  const [formData, setFormData] = useState({ task_name: '' })

  const handleChange = useCallback(
    (newValue: string, e?: { target: { name?: string } }) => {
      const name = e?.target?.name
      if (!name) {
        return
      }
      setFormData((current) => ({ ...current, [name]: newValue }))
    },
    []
  )

  const handleSubmitNewTask = useCallback(async () => {
    await onSubmitNewTask?.(formData?.task_name, parent_task_id)
    setFormData({ task_name: '' })
  }, [onSubmitNewTask, formData?.task_name, parent_task_id])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e?.key
      if (key !== 'Enter') {
        return
      }
      handleSubmitNewTask()
    },
    [handleSubmitNewTask]
  )

  return (
    <Flex
      alignItems="center"
      gap={2.2}
      onClick={(e) => {
        e?.stopPropagation()
      }}
      sx={{ cursor: 'default' }}
    >
      <Icon path={mdiPlus} size={1} />
      <CTextField
        name="task_name"
        onKeyDown={handleKeyDown}
        size="small"
        disableHelperText
        disableLabel
        placeholder="Add new Subtask"
        value={formData?.task_name}
        onChange={handleChange}
        fullWidth
        autoFocus
      />
      <Button
        iconButton
        icon={mdiCheck}
        variant="outlined"
        onClick={handleSubmitNewTask}
      />
    </Flex>
  )
}
