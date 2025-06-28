import React, { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import {
  BASE_ELEMENT_MODELS,
  EditorStateDbDataType,
  ElementModel,
  HtmlRenderer,
  query,
  useEditorRendererController,
} from '@cmk/fe_utils'
import axios from 'axios'
import { UserImage } from './components/UserImage'
import { QUERY_METHOD } from './api/00_utils/httpQuery'
import { GroupDetails } from './views/UsersGroupDetails'
import { TaskModal } from './views/TaskModal'
import { UpdatesSection } from './views/IndexUpdatesSection'
import { TasksSection } from './views/IndexTasksSection'
import { SchedulesSection } from './views/IndexSchedulesSection'
import { useAppController } from './appController/useAppController'
import { UsersYouSection } from './views/UsersYouSection'
import { TasksTableSection } from './views/TasksTableSection'
import { UpdatesTableSection } from './views/UpdatesTableSection'
import { SchedulesTableSection } from './views/SchedulesTableSection'

declare const BASE_URL: string

export type AppHtmlRendererProps = {
  appData: EditorStateDbDataType
}

export const AppHtmlRenderer = (props: AppHtmlRendererProps) => {
  const { appData } = props

  const location = useLocation()
  const [searchParams] = useSearchParams()
  const forcedLocation = searchParams.get('location')

  const {
    editorState,
    setEditorState,
    currentViewportElements,
    allElements,
    appController,
  } = useEditorRendererController({
    initialEditorState: appData as any,
  })

  const { actions, data, ui, setUi, dataChanges } = useAppController()
  const {
    getUser,
    getSchedules,
    deleteTask,
    navigateToGoogleLogin,
    createOrEditTask,
    verifyGoogleOauth,
    logoutUser,
    getDataChanges,
  } = actions

  const [iconData, setIconData] = React.useState<Record<string, string>>({})
  const [userImage, setUserImage] = React.useState<string | null>(null)

  const handleOpenNewTaskModal = useCallback(() => {
    setUi((current) => ({ ...current, tasksModal: true }))
  }, [])
  const handleClosTaskModal = useCallback(() => {
    setUi((current) => ({ ...current, tasksModal: null }))
  }, [])
  const handleOpenEditTaskModal = useCallback((task_id: number) => {
    console.log('handleOpenEditTaskModal', task_id)
    setUi((current) => ({ ...current, tasksModal: task_id }))
  }, [])

  useEffect(() => {
    const basePath = BASE_URL ?? '/'
    const basePathAdj =
      basePath && basePath !== '/' && basePath.slice(-1)[0] !== '/'
        ? basePath + '/'
        : basePath ?? '/'

    const fetchIconData = async () => {
      try {
        console.log('fetching icon data, basepath="', basePath + '"')
        const url = `${basePathAdj}mdi_icons.json`
        const response = await axios.get(url)
        const data = response.data
        if (!data) {
          throw new Error('No data found')
        }
        console.log('response', response, data)
        const iconData = data
        setIconData(iconData)
      } catch (e) {
        console.error('error', e)
      }
      setUi((prev: any) => ({
        ...prev,
        initialized: true,
      }))
    }

    fetchIconData()
    verifyGoogleOauth()
    getDataChanges()
    // getTasks();
  }, [verifyGoogleOauth])

  console.log("'AppHtmlRenderer DATA CHANGES'", dataChanges)

  const getIcon = useCallback(
    async (name: string) => {
      if (!iconData[name]) {
        console.warn('getIcon', name, 'not found')
        return null
      }
      return iconData[name]
    },
    [iconData]
  )

  const navigateRaw = useNavigate()
  const navigate = useCallback(
    (to: string) => {
      const toAdj = to.startsWith('/') ? to.slice(1) : to
      console.log('navigate', to, 'toAdj', toAdj)
      navigateRaw(toAdj)
    },
    [navigateRaw]
  )

  const theme = editorState.theme

  const adjPathName1 = forcedLocation
    ? forcedLocation
    : location.pathname === '/'
    ? 'index'
    : location.pathname.replace(BASE_URL, '') || 'index'
  const adjPathName = adjPathName1.startsWith('/')
    ? adjPathName1.slice(1)
    : adjPathName1

  console.log(
    'adjPathName',
    adjPathName,
    forcedLocation,
    location.pathname,
    BASE_URL
  )

  const editorInjections = useMemo(() => {
    const isLoggedUser = !!data?.user?.email
    const userGroup = data?.user?.groups?.[0]
    // const groupMembers = userGroup?.group_members

    const staticInjections: any = {
      elements: {
        // listnav index
        '2e2a3f38-b5ec-40b6-bd76-e28bdf58ad01': {
          value: '',
        },
        '51606897-b456-48ea-8110-6bf34e026a05': {
          value: 'users',
        },
        '92508310-e55e-41a9-8f07-d7a4dd3543f1': {
          value: 'tasks',
        },
        '52b618b9-f949-4541-8052-190a1583bcbe': {
          value: 'schedules',
        },
        '511fca47-8ca0-4445-b01b-13776fd49e7c': {
          onClick: navigateToGoogleLogin,
        },
        '4cf5b14d-6151-4b82-9cb4-95ac4185c496': { sx: { display: 'none' } },
        'e2bea8b3-41a1-400e-87cc-f610cf7fdfe6': {
          onClick: () => {
            handleOpenNewTaskModal()
          },
        },
        '29dc4c34-6f8a-40bb-bfcc-d8ccb0f0bada': {
          // disabled: true,
          // tooltip: '*Coming soon*',
          onClick: () => {
            navigate('/data_changes')
          },
        },
        // '5705cdc6-65e7-47fa-8f4c-eb51817e1a2f': {
        //   disabled: true,
        //   tooltip: '*Coming soon*',
        // },
        '1f787593-7b1d-4778-9844-dc9c08d5baf0': {
          onClick: logoutUser,
        },
      },
      elementReplacementComponent: {
        '7462cee5-9dc8-452b-a9d2-70c978792a1e': (
          <UpdatesSection data={data} dataChanges={dataChanges} />
        ),
        'b7cb6846-684e-4614-a60e-eb4eac5a8f4a': <TasksSection data={data} />,
        'd8a9b6ed-41fd-4fae-b0c5-08fd1f5517d2': (
          <SchedulesSection data={data} />
        ),
      },
    }
    if (isLoggedUser) {
      // components
      // appbar
      staticInjections.elementReplacementComponent[
        '4cf5b14d-6151-4b82-9cb4-95ac4185c496'
      ] = <UserImage src={userImage as any} key={userImage} />

      // index page
      staticInjections.elements['cabf631d-45b4-4432-9d6d-60e935d041d7'] = {
        label: `Welcome ${
          data?.user?.user_name || data?.user?.email || 'User'
        }`,
      }

      // users page
      staticInjections.elementReplacementComponent[
        '29ab1a9e-c690-45d3-b0be-1bc07cd24a8d'
      ] = (
        <UsersYouSection
          data={data}
          key={'users_you_section'}
          userImageSrc={userImage}
          updateUser={getUser}
        />
      )

      staticInjections.elementReplacementComponent[
        'deeca0a8-4c90-4512-b58d-c70ea468df1d'
      ] = <GroupDetails data={data} updateUser={getUser} />
    }

    // staticInjections.elements['ce3acc38-6f07-4021-9691-6470d0679ceb'] =
    //   taskTableDef(data, handleOpenEditTaskModal, deleteTask, createOrEditTask)
    staticInjections.elementReplacementComponent[
      'e73e34c5-3342-4b88-8073-a05ed8b968a4'
    ] = (
      <SchedulesTableSection
        data={data}
        deleteTask={deleteTask}
        createOrEditTask={createOrEditTask}
        openTaskModal={handleOpenEditTaskModal}
        openNewTaskModal={handleOpenNewTaskModal}
      />
    )
    staticInjections.elementReplacementComponent[
      'f7e36ae8-7fcf-45a5-a5da-06e4e8c43978'
    ] = (
      <TasksTableSection
        data={data}
        deleteTask={deleteTask}
        createOrEditTask={createOrEditTask}
        openTaskModal={handleOpenEditTaskModal}
        openNewTaskModal={handleOpenNewTaskModal}
      />
    )
    staticInjections.elementReplacementComponent[
      '0a57abc0-2c4d-47a2-b01f-22e5d2867c81'
    ] = (
      <UpdatesTableSection
        data={data}
        deleteTask={deleteTask}
        createOrEditTask={createOrEditTask}
        openTaskModal={handleOpenEditTaskModal}
        openNewTaskModal={handleOpenNewTaskModal}
        dataChanges={dataChanges}
      />
    )

    return staticInjections
  }, [
    navigateToGoogleLogin,
    data,
    userImage,
    handleOpenEditTaskModal,
    handleOpenNewTaskModal,
    deleteTask,
    getUser,
    logoutUser,
    createOrEditTask,
    dataChanges,
    navigate,
  ])

  useEffect(() => {
    if (data?.user?.photo_url) {
      if (!userImage) {
        const getUserImage = async () => {
          try {
            const imgResponse = await query(QUERY_METHOD.GET_FILE, {
              url: data?.user?.photo_url,
            })

            const imageDataIn = imgResponse?.data
            const reader = new FileReader()
            reader.onload = function (e) {
              const src = e?.target?.result // URL.createObjectURL(e?.target?.result as any);
              console.log('imgResponse', imgResponse, src)
              setUserImage(src as any)
            }
            reader.readAsDataURL(imageDataIn as any)
          } catch (e) {
            console.error('Error fetching user image', e)
            // setUserImage(null);
          }
        }
        getUserImage()
      }
    } else {
      setUserImage(null)
    }
  }, [data?.user?.photo_url])

  useEffect(() => {
    getSchedules()
  }, [])

  return ui.initialized ? (
    <>
      <HtmlRenderer
        allElements={allElements}
        uiActions={null as any}
        editorState={editorState}
        setEditorState={setEditorState}
        currentViewportElements={currentViewportElements}
        appController={appController}
        ELEMENT_MODELS={BASE_ELEMENT_MODELS as ElementModel[]}
        OverlayComponent={null as any}
        navigate={navigate}
        pageName={data?.user?.email ? adjPathName : 'login'}
        theme={theme}
        isProduction
        importIconByName={getIcon as any}
        injections={editorInjections}
      />
      {!!ui.tasksModal && (
        <TaskModal
          task_id={
            typeof ui.tasksModal === 'number' ? ui.tasksModal : undefined
          }
          data={data}
          open={!!ui.tasksModal}
          onClose={handleClosTaskModal}
          onConfirm={createOrEditTask}
        />
      )}
      {/* <Box
        // display="none"
        position="fixed"
        zIndex={10000000000}
        top={0}
        left={0}
        overflow="auto"
        width="100%"
        height="100%"
      >
        <Box width="100%" minWidth={520} height="100%">
          <DataGrid
            autosizeOnMount
            autosizeOptions={{ expand: true }}
            rows={data?.tasks ?? []}
            getRowId={(row) => row.task_id}
            columns={
              taskTableDef(
                data,
                handleOpenEditTaskModal,
                deleteTask,
                createOrEditTask
              )?.columns as any[]
            }
            disableColumnSelector={true}
          />
        </Box>
      </Box> */}
    </>
  ) : null
}
