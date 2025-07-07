import { Button, Flex, ListNavigation, Stack } from '@cmk/fe_utils'
import {
  mdiArrowTopRight,
  mdiCheckboxMarkedCirclePlusOutline,
  mdiCalendar,
  mdiAccountGroup,
  mdiClose,
} from '@mdi/js'
import {
  Typography,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
} from '@mui/material'
import { UsersYouSection } from '../views/users/UsersYouSection'
import { CAvatar } from './CAvatar'
import { AppControllerData } from '../appController/types/appControllerData'
import { AppControllerActions } from '../appController/useAppControllerActions'
import { AppControllerUi } from '../appController/types/appControllerUi'
import { useNavigate } from 'react-router-dom'

export type MobileDrawerProps = {
  userImage: string | null | undefined
  data: AppControllerData
  actions: AppControllerActions
  ui: AppControllerUi
}

declare const BASE_URL: string

export const MobileDrawer = (props: MobileDrawerProps) => {
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
    <Drawer
      open={!!ui.drawerOpen}
      //   onOpen={toggleDrawerOpen}
      onClose={toggleDrawerOpen}
      anchor="right"
      sx={{
        mt: '3rem',
        '& .MuiPaper-root': {
          //   mt: isMinSmViewport ? '3rem' : undefined,
          height: isMinSmViewport ? 380 : undefined,
          borderTopLeftRadius: isMinSmViewport ? undefined : '0.5rem',
          borderBottomLeftRadius: isMinSmViewport ? '0.5rem' : undefined,
        },
      }}
      slotProps={
        isMinSmViewport
          ? { backdrop: { sx: { bgcolor: 'transparent' } } }
          : undefined
      }
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        bgcolor="primary.main"
        pr={'1rem'}
        pl="2rem"
        height="3.3rem"
        minHeight="3.3rem"
      >
        <Typography variant="h6" fontWeight="bold" color="#000">
          Your Account
        </Typography>
        <Box width="2.5rem" position="relative">
          {userImage && userImage.startsWith('data:image') ? (
            <Box
              borderRadius={9999}
              width={'2.5rem'}
              height={'2.5rem'}
              overflow="hidden"
              borderColor={theme.palette.primary.main}
              border={'4px solid ' + data?.user?.user_color}
            >
              <img
                src={userImage}
                alt="user"
                style={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Box>
          ) : (
            <CAvatar
              sx={{
                width: 'calc(2.5rem - 10px)',
                height: 'calc(2.5rem - 10px)',
                // background: user?.user_color,
                fontSize: '2rem',
              }}
              user={data?.user}
            />
          )}
          <Box position="absolute" top={0} left={0}>
            <Button
              iconButton
              color="secondary"
              iconColor={'#666666cc'}
              icon={mdiClose}
              variant="text"
              borderRadius={9999}
              size="large"
              onClick={toggleDrawerOpen}
              sx={{
                opacity: 0,
                background: 'transparent',
                transition: 'opacity 1s, background: 1s',
                '&: hover': {
                  opacity: 0.85,
                  background: '#ccc',
                },
              }}
              iconSize={32}
            />
          </Box>
        </Box>
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
        {!isMinSmViewport && (
          <Box mt="2rem" flexGrow={1}>
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
        )}
        <Flex width="100%" justifyContent="center" mt="2rem">
          <Button variant="outlined" onClick={actions.logoutUser}>
            Logout
          </Button>
        </Flex>
      </Stack>
    </Drawer>
  )
}
