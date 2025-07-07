import { Dispatch, SetStateAction, useCallback, useMemo } from 'react'
import { API } from '../api/API'
import { getGoogleOauthLoginLink } from '../api/googleLink'
import { Schedule } from './types/schedule'
import { ScheduleEntry } from './types/scheduleEntry'
import { Task } from './types/tasks'
import { AppControllerData } from './types/appControllerData'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { AppControllerUi } from './types/appControllerUi'
import { AppControllerDataChanges } from './types/dataChanges'
import toast from 'react-hot-toast'

export type AppControllerActionsParams = {
  setData: Dispatch<SetStateAction<AppControllerData>>
  setUi: Dispatch<SetStateAction<AppControllerUi>>
  setDataChanges: Dispatch<SetStateAction<AppControllerDataChanges>>
}

export const useAppControllerActions = (params: AppControllerActionsParams) => {
  const { setData, setUi, setDataChanges } = params
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const urlParamState = searchParams.get('state')
  const urlParamCode = searchParams.get('code')

  const getUser = useCallback(async () => {
    const resUser = await API.getUser.query()
    const userData = resUser.data.data
    console.log('userData', userData)
    setData((prev) => ({
      ...prev,
      user: resUser?.data?.data || null,
    }))
  }, [setData])

  const logoutUser = useCallback(async () => {
    const resLogout = await API.logoutUser.query()
    const success = resLogout?.data?.success
    console.debug('logutRes', resLogout)
    if (success) {
      toast.success('Logout Successfull')
      setData((current) => ({ ...current, user: null, tasks: [] }))
      navigate('/login')
    } else {
      toast.error('Error logout')
    }
  }, [navigate, setData])

  const getTasks = useCallback(async () => {
    const resTasks = await API.getTasks.query()
    const tasks = resTasks?.data?.data || []
    setData((prev) => ({
      ...prev,
      tasks: tasks,
    }))
  }, [setData])

  const getSchedules = useCallback(async () => {
    const resSchedules = await API.getSchedules.query()
    const schedules = resSchedules?.data?.data || []
    setData((prev) => ({
      ...prev,
      schedules: schedules,
    }))
  }, [setData])

  const verifyGoogleOauth = useCallback(async () => {
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
        undefined
      )
      console.debug('RESVERIFY', resVerify)
      // return
      const userData = resVerify.data.user
      console.log('userData', userData)
      setData((prev) => ({
        ...prev,
        user: userData,
      }))
      getTasks()
      navigate('/')
    } else {
      console.log('No Google OAuth state or code found in URL')
      getUser()
      getTasks()
    }
  }, [getTasks, getUser, navigate, urlParamCode, urlParamState, setData])

  const deleteTask = useCallback(
    async (task_id: number) => {
      if (!task_id) {
        return
      }
      try {
        const resDeletion = await API.deleteTask(task_id).query()
        console.debug(resDeletion)
        if (resDeletion.data?.success) {
          getTasks()
        } else {
          throw resDeletion
        }
      } catch (e) {
        console.error(e)
        toast.error('An error has occured')
      }
    },
    [getTasks]
  )
  const navigateToGoogleLogin = useCallback(() => {
    const state = uuidv4()
    const link = getGoogleOauthLoginLink(state)
    window.location.href = link
  }, [])

  const createOrEditTask = useCallback(
    async (formData: Task, disableCloseTaskModal?: boolean) => {
      const isEdit = formData?.task_id
      const query = isEdit
        ? API.editTask(formData?.task_id).query
        : API.createTask.query
      const resQuery = await query(formData)
      if (resQuery?.data?.success) {
        if (!disableCloseTaskModal) {
          setUi((current) => ({ ...current, tasksModal: null }))
        }
        await getTasks()
      } else {
        toast.error('An error has occured')
      }
    },
    [getTasks, setUi]
  )

  const createOrEditSchedule = useCallback(
    async (formData: Schedule) => {
      const isEdit = formData?.schedule_id
      const query = isEdit
        ? API.editSchedule(formData?.schedule_id).query
        : API.createSchedule.query
      const resQuery = await query(formData)
      if (resQuery?.data?.success) {
        toast.success('Schedule successfully saved')
        setUi((current) => ({ ...current, scheduleModal: null }))
        await getSchedules()
      } else {
        toast.error('An error has occured')
      }
    },
    [getSchedules, setUi]
  )
  const deleteSchedule = useCallback(
    async (schedule_id: number) => {
      if (!schedule_id) {
        return
      }
      try {
        const resDeletion = await API.deleteSchedule(schedule_id).query()
        console.debug(resDeletion)
        if (resDeletion.data?.success) {
          toast.success('schedule successfully deleted')
          getSchedules()
        } else {
          throw resDeletion
        }
      } catch (e) {
        console.error(e)
        toast.error('An error has occured')
      }
    },
    [getSchedules]
  )

  const createOrEditScheduleEntry = useCallback(
    async (formData: ScheduleEntry) => {
      const isEdit = !!formData?.schedule_entry_id
      const query = isEdit
        ? API.editScheduleEntry(formData?.schedule_entry_id).query
        : API.createScheduleEntry.query
      const resQuery = await query(formData)
      if (resQuery?.data?.success) {
        toast.success('schedule successfully saved')
        setUi((current) => ({ ...current, scheduleModal: null }))
        await getSchedules()
      } else {
        toast.error('An error has occured')
      }
    },
    [getSchedules, setUi]
  )
  const deleteScheduleEntry = useCallback(
    async (schedule_entry_id: number) => {
      if (!schedule_entry_id) {
        return
      }
      try {
        const resDeletion = await API.deleteScheduleEntry(
          schedule_entry_id
        ).query()
        console.debug(resDeletion)
        if (resDeletion.data?.success) {
          toast.success('schedule successfully deleted')
          getSchedules()
        } else {
          throw resDeletion
        }
      } catch (e) {
        console.error(e)
        toast.error('An error has occured')
      }
    },
    [getSchedules]
  )

  const toggleDrawerOpen = useCallback(() => {
    setUi((current) => ({ ...current, drawerOpen: !current?.drawerOpen }))
  }, [setUi])

  const getDataChanges = useCallback(async () => {
    const resChanges = await API.getDataChanges.query()
    const { user_changes, data_changes } = resChanges?.data?.data || {}
    setDataChanges({
      user_changes: user_changes || [],
      data_changes: data_changes || [],
    })
  }, [setDataChanges])

  const openNewScheduleModal = useCallback(() => {
    setUi((current) => ({ ...current, scheduleModal: true }))
  }, [setUi])

  const openEditScheduleModal = useCallback(
    (schedule_id: number) => {
      setUi((current) => ({
        ...current,
        scheduleModal: schedule_id,
      }))
    },
    [setUi]
  )
  const closeScheduleModal = useCallback(() => {
    setUi((current) => ({ ...current, scheduleModal: null }))
  }, [setUi])

  const openSchedulesEntrysModal = useCallback(
    (schedule_id: number) => {
      setUi((current) => ({
        ...current,
        scheduleEntryModal: schedule_id,
      }))
    },
    [setUi]
  )
  const closeScheduleEntryModal = useCallback(() => {
    setUi((current) => ({
      ...current,
      scheduleEntryModal: null,
    }))
  }, [setUi])

  const openNewTaskModal = useCallback(() => {
    setUi((current) => ({ ...current, tasksModal: true }))
  }, [setUi])
  const closTaskModal = useCallback(() => {
    setUi((current) => ({ ...current, tasksModal: null }))
  }, [setUi])
  const openEditTaskModal = useCallback(
    (task_id: number) => {
      setUi((current) => ({ ...current, tasksModal: task_id }))
    },
    [setUi]
  )

  const actions = useMemo(() => {
    return {
      getTasks,
      getSchedules,
      deleteTask,
      getUser,
      verifyGoogleOauth,
      navigateToGoogleLogin,
      createOrEditTask,
      createOrEditSchedule,
      logoutUser,
      getDataChanges,
      deleteSchedule,
      createOrEditScheduleEntry,
      deleteScheduleEntry,
      // ui
      toggleDrawerOpen,
      openNewScheduleModal,
      openEditScheduleModal,
      openSchedulesEntrysModal,
      closeScheduleModal,
      closeScheduleEntryModal,
      openEditTaskModal,
      closTaskModal,
      openNewTaskModal,
    }
  }, [
    getTasks,
    getSchedules,
    getUser,
    verifyGoogleOauth,
    navigateToGoogleLogin,
    deleteTask,
    createOrEditTask,
    createOrEditSchedule,
    logoutUser,
    getDataChanges,
    deleteSchedule,
    createOrEditScheduleEntry,
    deleteScheduleEntry,
    // ui
    toggleDrawerOpen,
    openNewScheduleModal,
    openEditScheduleModal,
    openSchedulesEntrysModal,
    closeScheduleModal,
    closeScheduleEntryModal,
    openEditTaskModal,
    closTaskModal,
    openNewTaskModal,
  ])
  return actions
}

export type AppControllerActions = ReturnType<typeof useAppControllerActions>
