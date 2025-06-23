import { useCallback, useMemo, useState } from 'react'
import { API } from '../api/API'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { getGoogleOauthLoginLink } from '../api/googleLink'

export const useAppController = () => {
  const [data, setData] = useState<any>({ user: null as any, tasks: [] })
  const [ui, setUi] = useState<{
    initialized: boolean
    tasksModal: null | number | true
  }>({ initialized: false, tasksModal: null })

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const urlParamState = searchParams.get('state')
  const urlParamCode = searchParams.get('code')
  // const urlParamScope = searchParams.get("scope");

  const getUser = useCallback(async () => {
    const resUser = await API.getUser.query()
    const userData = resUser.data.data
    console.log('userData', userData)
    setData((prev: any) => ({
      ...prev,
      user: resUser?.data?.data || null,
    }))
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
      getUser()
      getTasks()
    }
  }, [getTasks, getUser, navigate, urlParamCode, urlParamState])

  const deleteTask = useCallback(
    async (task_id: number) => {
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
    },
    [getTasks]
  )
  const navigateToGoogleLogin = useCallback(() => {
    const state = uuidv4()
    const link = getGoogleOauthLoginLink(state)
    window.location.href = link
  }, [])

  const createOrEditTask = useCallback(
    async (formData: any) => {
      const isEdit = formData?.task_id
      const query = isEdit
        ? API.editTask(formData?.task_id).query
        : API.createTask.query
      const resQuery = await query(formData)
      if (resQuery?.data?.success) {
        alert('Successfully saved')
        setUi((current) => ({ ...current, tasksModal: null }))
        await getTasks()
      } else {
        alert('An error has occured')
      }
    },
    [getTasks]
  )

  const actions = useMemo(() => {
    return {
      getTasks,
      deleteTask,
      getUser,
      verifyGoogleOauth,
      navigateToGoogleLogin,
      createOrEditTask,
    }
  }, [
    getTasks,
    getUser,
    verifyGoogleOauth,
    navigateToGoogleLogin,
    deleteTask,
    createOrEditTask,
  ])

  return { data, actions, ui, setUi }
}
