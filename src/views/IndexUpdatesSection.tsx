import { Box, Chip, Typography } from '@mui/material'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { formatUserName } from '../utils/formatUsername'
import { useCallback } from 'react'
import { mdiDelete, mdiPencil, mdiPlus } from '@mdi/js'
import { Icon } from '@mdi/react'
import { Flex } from '@cmk/fe_utils'

const idFieldNames = {
  tasks: 'task_id',
  groups: 'group_id',
  users: 'user_id',
}
const labelsDict = {
  tasks: 'task_name',
  groups: 'group_id',
  users: 'user_id',
}

export type UpdatesSectionProps = {
  data: any
  dataChanges: {
    user_changes: any[]
    data_changes: any[]
  }
}
declare const BASE_URL: string

export const UpdatesSection = (props: UpdatesSectionProps) => {
  const { data, dataChanges } = props
  const { user_changes } = dataChanges
  const groupMembers = data?.user?.groups?.[0]?.group_members ?? []

  const navigateRaw = useNavigate()
  const navigate = useCallback(
    (to: string) => {
      const toAdj = to.startsWith('/') ? to.slice(1) : to
      const destination = BASE_URL + toAdj
      console.log('navigate', to, 'toAdj', toAdj, 'destination', destination)
      navigateRaw(destination)
    },
    [navigateRaw]
  )

  return (
    <Box mt="0.5rem">
      {/* <Typography>currently only updates for created tasks</Typography> */}
      {user_changes
        ?.slice(0, 5)
        // ?.filter((task) => task.created_at)
        // ?.sort((a, b) =>
        //   moment(a).isAfter(moment(b))
        //     ? 1
        //     : moment(a).isBefore(moment(b))
        //     ? -1
        //     : 0
        // )
        .map((dc) => {
          const owner = groupMembers?.find?.(
            (member) => member.user_id === dc?.user_id
          )
          const idFieldName = idFieldNames[dc?.entity_name]
          const entityInstance = data?.[dc?.entity_name]?.find?.(
            (entity) =>
              entity?.[idFieldName] ===
              (dc?.entity_instance_id ? parseInt(dc?.entity_instance_id) : null)
          )

          console.log(
            'dc',
            dc,
            idFieldName,
            entityInstance,
            data?.[dc?.entity_name],
            dc?.entity_instance_id
          )
          return (
            <Flex
              alignItems={'center'}
              key={dc?.change_id}
              gap="0.25rem"
              ml={'0.25rem'}
            >
              <Icon
                path={
                  dc?.change_type === 'create'
                    ? mdiPlus
                    : dc?.change_type === 'delete'
                    ? mdiDelete
                    : mdiPencil
                }
                size={0.8}
                // style={{ marginRight: '0.5rem' }}
              ></Icon>
              <Typography>
                {owner ? formatUserName(owner) : ''} has{' '}
                {dc?.change_type === 'create'
                  ? 'created'
                  : dc?.change_type === 'delete'
                  ? 'deleted'
                  : 'edited'}{' '}
                a {dc?.entity_name}:
                <Chip
                  size="small"
                  clickable
                  label={
                    entityInstance?.[labelsDict[dc?.entity_name]] || 'unknown'
                  }
                  onClick={() => {
                    navigate('tasks')
                  }}
                ></Chip>
              </Typography>
            </Flex>
          )
        })}
    </Box>
  )
}
