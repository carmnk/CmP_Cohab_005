import { Button, Flex, ListNavigation, Stack } from '@cmk/fe_utils'
import {
  mdiArrowTopRight,
  mdiCheckboxMarkedCirclePlusOutline,
  mdiCalendar,
  mdiAccountGroup,
} from '@mdi/js'
import {
  SwipeableDrawer,
  Typography,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { UsersYouSection } from '../views/users/UsersYouSection'
import { CAvatar } from './CAvatar'
import { AppControllerData } from '../appController/types/appControllerData'
import { AppControllerActions } from '../appController/useAppControllerActions'
import { AppControllerUi } from '../appController/types/appControllerUi'
import { useNavigate } from 'react-router-dom'

export type DesktopDrawerProps = {
  userImage: string | null | undefined
  data: AppControllerData
  actions: AppControllerActions
  ui: AppControllerUi
}

declare const BASE_URL: string

export const DesktopDrawer = (props: DesktopDrawerProps) => {
  const { data, actions, userImage, ui } = props

  const { toggleDrawerOpen } = actions
  const navigate = useNavigate()
  const theme = useTheme()
  const isMinSmViewport = useMediaQuery(theme.breakpoints.up('sm'))

  const adjPathName1 =
    location.pathname === '/'
      ? 'index'
      : location.pathname.replace(BASE_URL, '') || 'index'
  const adjPathName = adjPathName1.startsWith('/')
    ? adjPathName1.slice(1)
    : adjPathName1

  return (
    <SwipeableDrawer
      open={!!ui.drawerOpen}
      onOpen={toggleDrawerOpen}
      onClose={toggleDrawerOpen}
      anchor="right"
      sx={{
        mt: '3rem',
        '& .MuiPaper-root': {
          // mt: '3rem',
          height: isMinSmViewport ? 640 : undefined,
          bgcolor: isMinSmViewport ? 'orange' : undefined,
          borderTopLeftRadius: '0.5rem',
        },
      }}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        bgcolor="primary.main"
        pr={'1rem'}
        pl="2rem"
      >
        <Typography variant="h6" fontWeight="bold" color="#000">
          Your Account
        </Typography>
        {userImage && userImage.startsWith('data:image') ? (
          <Box
            borderRadius={9999}
            width={64}
            height={64}
            overflow="hidden"
            borderColor={theme.palette.primary.main}
            border={'2px solid ' + data?.user?.user_color}
          >
            <img src={userImage} alt="user" width={64} height={64} />
          </Box>
        ) : (
          <CAvatar
            sx={{
              width: 'calc(4rem - 10px)',
              height: 'calc(4rem - 10px)',
              // background: user?.user_color,
              fontSize: '2rem',
            }}
            user={data?.user}
          />
        )}
      </Flex>

      <Stack width={'20rem'} p="2rem" pr="1rem" height="100%">
        <UsersYouSection
          data={data}
          userImageSrc={userImage ?? null}
          disableEdit
        />
        <Flex mt="1rem" justifyContent="flex-end">
          <Button
            variant="outlined"
            icon={mdiArrowTopRight}
            onClick={() => {
              navigate('/users')
              toggleDrawerOpen()
            }}
          >
            Edit
          </Button>
        </Flex>
        <Box mt="2rem">
          <Divider />
        </Box>
        <Box mt="2rem" flexGrow={1}>
          {/* <Typography variant="body1" fontWeight="bold">
              Navigation
            </Typography> */}

          <ListNavigation
            value={adjPathName}
            onChange={(newValue) => {
              navigate(newValue)
              toggleDrawerOpen()
            }}
            items={[
              {
                label: 'Tasks',
                value: 'tasks',
                icon: mdiCheckboxMarkedCirclePlusOutline,
              },
              {
                label: 'Schedules',
                value: 'schedules',
                icon: mdiCalendar,
              },
              {
                label: 'Users and Group',
                value: 'users',
                icon: mdiAccountGroup,
              },
            ]}
          />
        </Box>
        <Flex width="100%" justifyContent="center" mt="2rem">
          <Button variant="outlined" onClick={actions.logoutUser}>
            Logout
          </Button>
        </Flex>
      </Stack>
    </SwipeableDrawer>
  )
}
