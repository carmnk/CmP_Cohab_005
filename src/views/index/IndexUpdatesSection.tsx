import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { AppControllerData } from '../../appController/types/appControllerData'
import { AppControllerDataChanges } from '../../appController/types/dataChanges'
import { UserChangeUserOutput } from './UserChangeUserOutput'

export type UpdatesSectionProps = {
  data: AppControllerData
  dataChanges: AppControllerDataChanges
  start?: number
  end?: number
}
declare const BASE_URL: string

export const UpdatesSection = (props: UpdatesSectionProps) => {
  const { data, dataChanges, start = 0, end = undefined } = props
  const { user_changes } = dataChanges
  const groupMembers = data?.user?.groups?.[0]?.group_members ?? []

  const theme = useTheme()
  const isMinSmViewport = useMediaQuery(theme.breakpoints.up('sm'))
  const isMinMdViewport = useMediaQuery(theme.breakpoints.up('md'))

  const [ui, setUi] = useState({ userChangeDialog: null as number | null })

  const handleOpenUserChangeDialog = useCallback((userChangeId: number) => {
    setUi((current) => ({ ...current, userChangeDialog: userChangeId }))
  }, [])
  const handleCloseUserChangeDialog = useCallback(() => {
    setUi((current) => ({ ...current, userChangeDialog: null }))
  }, [])

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

  const defaultChangesEndAdj = isMinMdViewport ? 5 : 3

  const userChange = useMemo(() => {
    return dataChanges?.user_changes?.find(
      (uc) => uc.user_change_id === ui?.userChangeDialog
    )
  }, [dataChanges, ui?.userChangeDialog])

  return (
    <Box mt="0.5rem">
      {/* <Typography>currently only updates for created tasks</Typography> */}
      {user_changes
        ?.slice(start ?? 0, end ?? defaultChangesEndAdj)
        .map((dc) => {
          return (
            <UserChangeUserOutput
              data={data}
              dc={dc}
              onOpenUserChangeDialog={handleOpenUserChangeDialog}
            />
          )
        })}
      {typeof ui?.userChangeDialog === 'number' && userChange && (
        <Dialog
          open
          onClose={handleCloseUserChangeDialog}
          slotProps={{ paper: { sx: { mx: '1rem' } } }}
        >
          <DialogTitle>Datachange</DialogTitle>

          <DialogContent>
            <Box>
              <UserChangeUserOutput
                data={data}
                dc={userChange}
                onOpenUserChangeDialog={handleOpenUserChangeDialog}
                disableOpenDetails
              />
              {!!dataChanges?.data_changes?.filter(
                (dc) => dc.user_change_id === ui?.userChangeDialog
              )?.length && (
                <Box
                  mt="1rem"
                  display="grid"
                  gridTemplateColumns="auto auto auto"
                  gap="0.25rem 1rem"
                >
                  <Typography fontWeight={500}>Field</Typography>
                  <Typography fontWeight={500}>Old Value</Typography>
                  <Typography fontWeight={500}>New Value</Typography>
                  {dataChanges?.data_changes
                    ?.filter((dc) => dc.user_change_id === ui?.userChangeDialog)
                    ?.map((dc) => (
                      <Fragment key={dc.data_change_id}>
                        <Typography
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >{`${dc?.field_name}`}</Typography>
                        <Typography
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >{`${dc?.old_value}`}</Typography>
                        <Typography
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >{`${dc?.new_value}`}</Typography>
                      </Fragment>
                    ))}
                </Box>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  )
}
