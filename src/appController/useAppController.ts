import { useState } from 'react'
import { AppControllerData } from './types/appControllerData'
import { AppControllerUi } from './types/appControllerUi'
import { useAppControllerActions } from './useAppControllerActions'
import { AppControllerDataChanges } from './types/dataChanges'

export const useAppController = () => {
  const [data, setData] = useState<AppControllerData>({
    user: null,
    tasks: [],
    schedules: [],
  })
  const [dataChanges, setDataChanges] = useState<AppControllerDataChanges>({
    user_changes: [],
    data_changes: [],
  })
  const [ui, setUi] = useState<AppControllerUi>({
    initialized: false,
    tasksModal: null,
    scheduleModal: null,
    drawerOpen: false,
  })

  const actions = useAppControllerActions({ setData, setUi, setDataChanges })

  return { data, actions, dataChanges, ui, setUi }
}
