import { Button, Flex } from '@cmk/fe_utils'
import { mdiPlus, mdiDelete, mdiPencil, mdiOpenInNew } from '@mdi/js'
import { Typography, Chip, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { formatUserName } from '../../utils/formatUsername'
import { getRecursiveParentTaskIds } from '../tasks/TaskModal'
import Icon from '@mdi/react'
import { UserChange } from '../../appController/types/dataChanges'
import { PublicUser } from '../../appController/types/publicUser'
import moment from 'moment'
import { useMemo } from 'react'
import { AppControllerData } from '../../appController/types/appControllerData'

export type UserChangeUserOutputProps = {
  dc: UserChange
  data: AppControllerData
  onOpenUserChangeDialog: (user_change_id_: number) => void
  disableOpenDetails?: boolean
}

export const idFieldNames = {
  tasks: 'task_id',
  groups: 'group_id',
  users: 'user_id',
  schedules: 'schedule_id',
  schedule_entrys: 'schedule_entry_id',
}
const labelsDict = {
  tasks: 'task_name',
  groups: 'group_id',
  users: 'user_id',
  schedules: 'schedule_name',
  schedule_entrys: 'entry_start',
}

const getEntityLabel = (
  entityInstance: Record<string, unknown>,
  entity_name: string,
  data: AppControllerData
): string => {
  if (entity_name === 'schedule_entrys') {
    return (
      data?.schedules?.find(
        (sched) => sched.schedule_id === entityInstance?.schedule_id
      )?.schedule_name +
      (entityInstance?.entry_start
        ? ' - for ' + moment(entityInstance?.entry_start)?.format('DD.MM.YYYY')
        : '')
    )
  }
  return (entityInstance?.[labelsDict[entity_name]] as string) || 'unknown'
}

export const UserChangeUserOutput = (props: UserChangeUserOutputProps) => {
  const { dc, data, onOpenUserChangeDialog, disableOpenDetails } = props
  const groupMembers = data?.user?.groups?.[0]?.group_members ?? []

  const navigate = useNavigate()

  const owner = groupMembers?.find?.((member) => member.user_id === dc?.user_id)
  const idFieldName = idFieldNames[dc?.entity_name]
  const entities =
    dc?.entity_name === 'schedule_entrys'
      ? data?.schedules?.map((sched) => sched.schedule_entrys).flat()
      : data?.[dc?.entity_name]
  const entityInstance = entities?.find?.(
    (entity) =>
      entity?.[idFieldName] ===
      (dc?.entity_instance_id ? parseInt(dc?.entity_instance_id as any) : null)
  )

  const isTaskEntity = dc?.entity_name === 'tasks'
  const changeDatetime = useMemo(
    () => (dc.change_datetime ? moment(dc.change_datetime) : null),
    [dc]
  )
  const dateString = changeDatetime
    ? (changeDatetime.isSame(moment(), 'day')
        ? changeDatetime.format('HH:mm')
        : changeDatetime.format('DD.MM.YYYY HH:mm')) + ' - '
    : ''

  console.log('EEINST ', entityInstance, idFieldName)
  return (
    <Flex
      alignItems={'flex-start'}
      key={dc?.user_change_id}
      gap="0.25rem"
      ml={'0.25rem'}
    >
      <Box width="max-content" mt="0.25rem">
        <Icon
          path={
            dc?.change_type === 'create'
              ? mdiPlus
              : dc?.change_type === 'delete'
              ? mdiDelete
              : mdiPencil
          }
          size={0.8}
        ></Icon>
      </Box>
      <Typography>
        {dateString}
        {owner ? formatUserName(owner) : 'unknown'} has{' '}
        {dc?.change_type === 'create'
          ? 'created'
          : dc?.change_type === 'delete'
          ? 'deleted'
          : 'edited'}{' '}
        a {dc?.entity_name?.slice?.(0, -1)}:
        {isTaskEntity ? (
          (() => {
            const task_id = dc?.entity_instance_id
              ? parseInt(dc?.entity_instance_id as any)
              : null
            if (!task_id) return null
            const recursiveParentTaskIds = task_id
              ? [
                  task_id,
                  ...(getRecursiveParentTaskIds(task_id, data?.tasks) ?? []),
                ]
              : []
            const recursiveParentTasks = recursiveParentTaskIds
              ?.map?.((taskId) =>
                data?.tasks?.find((task) => task.task_id === taskId)
              )
              ?.filter((val) => val)
              .reverse()
            return (
              recursiveParentTasks &&
              recursiveParentTasks?.map((task, tIdx) => (
                <Fragment key={tIdx}>
                  <Chip
                    size="small"
                    clickable
                    label={task?.task_name}
                    onClick={() => {
                      navigate('tasks')
                    }}
                  />
                  {tIdx !== recursiveParentTasks?.length - 1 && (
                    <Typography variant="caption">»</Typography>
                  )}
                </Fragment>
              ))
            )
          })()
        ) : (
          <Chip
            size="small"
            clickable
            label={getEntityLabel(entityInstance, dc?.entity_name, data)}
            onClick={() => {
              if (dc?.entity_name === 'tasks') {
                navigate('tasks')
              } else if (dc?.entity_name === 'schedules') {
                navigate('schedules')
              }
            }}
          />
        )}
      </Typography>
      {!disableOpenDetails && (
        <Box ml="auto" pr={'0.5rem'} color="#666">
          <Button
            iconColor="#666"
            variant="outlined"
            iconButton
            icon={mdiOpenInNew}
            color="inherit"
            size="small"
            iconSize={1}
            sx={{ height: 24, width: 24 }}
            onClick={() => {
              onOpenUserChangeDialog(dc?.user_change_id)
            }}
          />
        </Box>
      )}
    </Flex>
  )
}
