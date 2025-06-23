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
import { v4 as uuidv4 } from 'uuid'
import { getGoogleOauthLoginLink } from './api/googleLink'
import { API } from './api/API'
import { UserImage } from './components/UserImage'
import { QUERY_METHOD } from './api/00_utils/httpQuery'
import { GroupDetails } from './components/GroupDetails'
import { formatUserName } from './utils/formatUsername'
import { TaskModal } from './components/TaskModal'
import { taskTableDef } from './components/tableDefs/taskTableDef'
import { usersTableDef } from './components/tableDefs/usersTableDef'
import { UpdatesSection } from './components/UpdatesSection'
import { TasksSection } from './components/TasksSection'
import { SchedulesSection } from './components/SchedulesSection'

declare const BASE_URL: string

export type AppHtmlRendererProps = {
  appData: EditorStateDbDataType
}

export const AppHtmlRenderer = (props: AppHtmlRendererProps) => {
  const { appData } = props

  const location = useLocation()
  const [searchParams] = useSearchParams()
  const urlParamState = searchParams.get('state')
  const urlParamCode = searchParams.get('code')
  // const urlParamScope = searchParams.get("scope");
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

  const [iconData, setIconData] = React.useState<Record<string, string>>({})
  const [ui, setUi] = React.useState<{
    initialized: boolean
    tasksModal: null | number | true
  }>({ initialized: false, tasksModal: null })
  const [data, setData] = React.useState<any>({ user: null as any, tasks: [] })
  const [userImage, setUserImage] = React.useState<string | null>(null)

  const handleOpenNewTaskModal = useCallback(() => {
    setUi((current) => ({ ...current, tasksModal: true }))
  }, [])
  const handleClosTaskModal = useCallback(() => {
    setUi((current) => ({ ...current, tasksModal: null }))
  }, [])
  const handleOpenEditTaskModal = useCallback((task_id: number) => {
    setUi((current) => ({ ...current, tasksModal: task_id }))
  }, [])

  const getTasks = useCallback(async () => {
    const resTasks = await API.getTasks.query()
    const tasks = resTasks?.data?.data || []
    setData((prev: any) => ({
      ...prev,
      tasks: tasks,
    }))
    console.log('resTasks', resTasks, 'tasks', tasks)
  }, [])

  const handleDeleteTask = useCallback(async (task_id: number) => {
    if (!task_id) {
      return
    }
    try {
      const resDeletion = await API.deleteTask(task_id).query()
      if (resDeletion.data?.success) {
        console.log(resDeletion)
        // alert("Task successfully deleted");
        getTasks()
      } else {
        throw resDeletion
      }
    } catch (e) {
      console.error(e)
      alert('an error has occured')
    }
  }, [])

  useEffect(() => {
    const basePath = BASE_URL ?? '/'
    const basePathAdj =
      basePath && basePath !== '/' && basePath.slice(-1)[0] !== '/'
        ? basePath + '/'
        : basePath ?? '/'
    const verifyGoogleOauth = async () => {
      if (urlParamState && urlParamCode) {
        console.log(
          'Google OAuth state and code found in URL',
          urlParamState,
          urlParamCode
        )
        const resVerify = await API.verifyGoogleLogin.query(
          {
            code: urlParamCode as string,
          },
          undefined,
          undefined,
          undefined,
          window?.location?.hostname !== 'localhost' &&
            window?.location?.hostname.startsWith('192')
            ? { baseUrl: 'http://' + window?.location?.hostname }
            : (undefined as any)
        )
        console.debug('RESVERIFY', resVerify)
        // return
        const userData = resVerify.data.user
        console.log('userData', userData)
        setData((prev: any) => ({
          ...prev,
          user: userData,
        }))
        getTasks()
        navigate('/')
      } else {
        console.log('No Google OAuth state or code found in URL')
        const resUser = await API.getUser.query()
        const userData = resUser.data.data
        console.log('userData', userData)
        getTasks()
        setData((prev: any) => ({
          ...prev,
          user: resUser?.data?.data || null,
        }))
      }
    }

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
    // getTasks();
  }, [])

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

  const navigateToGoogleLogin = useCallback(() => {
    const state = uuidv4()
    const link = getGoogleOauthLoginLink(state)
    window.location.href = link
  }, [])

  const editorInjections = useMemo(() => {
    const isLoggedUser = !!data?.user?.email
    const groupMembers = data?.user?.groups?.[0]?.group_members

    const staticInjections: any = {
      elements: {
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
          disabled: true,
          tooltip: '*Coming soon*',
        },
        '5705cdc6-65e7-47fa-8f4c-eb51817e1a2f': {
          disabled: true,
          tooltip: '*Coming soon*',
        },
      },
      elementReplacementComponent: {
        '7462cee5-9dc8-452b-a9d2-70c978792a1e': <UpdatesSection data={data} />,
        'b7cb6846-684e-4614-a60e-eb4eac5a8f4a': <TasksSection data={data} />,
        'd8a9b6ed-41fd-4fae-b0c5-08fd1f5517d2': (
          <SchedulesSection data={data} />
        ),
      },
    }
    if (isLoggedUser) {
      // components
      // appbar
      staticInjections.elements['b4097a2a-65bd-4d37-9732-9a6c7bb64442'] = {
        src: userImage ?? '',
      }
      // index page
      staticInjections.elements['cabf631d-45b4-4432-9d6d-60e935d041d7'] = {
        label: `Welcome ${
          data?.user?.user_name || data?.user?.email || 'User'
        }`,
      }

      // users page
      staticInjections.elements['f0a6d968-dfbb-45fc-9fab-2aa142b1f538'] = {
        label: formatUserName(data?.user),
      }
      staticInjections.elements['58992f99-5ddd-44fc-8da6-325c6699a122'] = {
        label: `${data?.user?.email}`,
      }
      staticInjections.elementReplacementComponent[
        '4cf5b14d-6151-4b82-9cb4-95ac4185c496'
      ] = <UserImage src={userImage as any} key={userImage} />
    }

    staticInjections.elements['ce3acc38-6f07-4021-9691-6470d0679ceb'] =
      taskTableDef(data, handleOpenEditTaskModal, handleDeleteTask)

    if (data?.user?.groups?.length) {
      // groups page
      staticInjections.elements['4a36426f-5da2-44e4-87ee-22c36f67eef0'] = {
        label: data?.user?.groups?.[0].group_name
          ? `${data?.user?.groups?.[0].group_name}`
          : 'Specify group name',
        color: data?.user?.groups?.[0].group_name
          ? undefined
          : 'text.secondary',
        fontStyle: data?.user?.groups?.[0].group_name ? undefined : 'italic',
      }
      staticInjections.elements['8a021532-ceb6-495a-a92d-b803280c2a11'] =
        usersTableDef(data)

      staticInjections.elements['ae967b9b-5f9d-49f0-810a-2d2e1a420fab'] = {
        disabled:
          data?.user?.groups?.[0].group_admin_user_id !== data?.user?.user_id,
        tooltip:
          data?.user?.groups?.[0].group_admin_user_id !== data?.user?.user_id
            ? 'You are not the group admin'
            : undefined,
      }
    } else {
      // groups page
      staticInjections.elements['4a36426f-5da2-44e4-87ee-22c36f67eef0'] = {
        label: 'Your are not yet part of any group',
      }
      staticInjections.elementReplacementComponent[
        '72e6aba0-ab37-487b-a7f5-ca902879d589'
      ] = <GroupDetails data={data} />
      staticInjections.elements['ae967b9b-5f9d-49f0-810a-2d2e1a420fab'] = {
        disabled:
          data?.user?.groups?.[0].group_admin_user_id !== data?.user?.user_id,
        tooltip:
          data?.user?.groups?.[0].group_admin_user_id !== data?.user?.user_id
            ? 'You are not the group admin'
            : undefined,
      }
    }

    return staticInjections
  }, [
    navigateToGoogleLogin,
    data,
    userImage,
    handleOpenEditTaskModal,
    handleOpenNewTaskModal,
    handleDeleteTask,
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

  const handleSubmitTask = useCallback(
    async (formData: any) => {
      const isEdit = formData?.task_id
      const query = isEdit
        ? API.editTask(formData?.task_id).query
        : API.createTask.query
      const resQuery = await query(formData)
      if (resQuery?.data?.success) {
        alert('Successfully saved')
        await getTasks()
      } else {
        alert('An error has occured')
      }
    },
    [getTasks]
  )

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
          onConfirm={handleSubmitTask}
        />
      )}
    </>
  ) : null
}
