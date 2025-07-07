import { Task } from '../appController/types/tasks'

export const getRecursiveParentTaskIds = (
  task_id: number,
  tasks: Task[]
): number[] => {
  const task = tasks?.find((t) => t.task_id === task_id)
  const parentId = task?.parent_task_id
  const recursiveTasks = parentId
    ? getRecursiveParentTaskIds(parentId, tasks)
    : []
  return [parentId, ...recursiveTasks].filter(
    (val) => val && val !== 0
  ) as number[]
}
