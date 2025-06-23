import { Box, Chip, Typography } from '@mui/material'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { formatUserName } from '../utils/formatUsername'
import { useCallback } from 'react'

export type UpdatesSectionProps = {
  data: any
}
declare const BASE_URL: string

export const UpdatesSection = (props: UpdatesSectionProps) => {
  const { data } = props
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
    <Box>
      <Typography>currently only updates for created tasks</Typography>
      {data?.tasks
        ?.filter((task) => task.created_at)
        ?.sort((a, b) =>
          moment(a).isAfter(moment(b))
            ? 1
            : moment(a).isBefore(moment(b))
            ? -1
            : 0
        )
        .map((task) => {
          const owner = groupMembers?.find?.(
            (member) => member.user_id === task.owner_user_id
          )
          return (
            <Typography>
              {' '}
              - {owner ? formatUserName(owner) : ''} has added a new task:{' '}
              <Chip
                size="small"
                clickable
                label={task.task_name}
                onClick={() => {
                  navigate('tasks')
                }}
              ></Chip>
            </Typography>
          )
        })}
    </Box>
  )
}
