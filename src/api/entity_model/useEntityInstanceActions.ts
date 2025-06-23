import { useCallback } from 'react'
import { API } from '../API'

export const useGetEntityInstance = (
  entityInstanceId: number,
  baseEntityId: number,
  currentBaseEntityIdFieldName: string,
  setFormData?: (data: unknown) => void
) => {
  const getInstance = useCallback(async () => {
    if (!baseEntityId || !currentBaseEntityIdFieldName) {
      return
    }
    try {
      const res = await API.getEntityInstance(
        baseEntityId,
        entityInstanceId
      ).query()
      setFormData?.(res?.data?.message)
      return res
    } catch (e) {
      console.error(e)
    }
  }, [
    baseEntityId,
    currentBaseEntityIdFieldName,
    entityInstanceId,
    setFormData,
  ])

  return getInstance
}

export const useDeleteEntityInstance = (
  entityInstanceId: number,
  baseEntityId: number,
  onUpdate?: () => void
) => {
  const deleteInstance = useCallback(async () => {
    if (!baseEntityId) return
    try {
      const _res = await API.deleteEntityInstance(
        baseEntityId,
        entityInstanceId
      ).query()
      await onUpdate?.()
      // showToast(TOASTS.entities.successDeleteEntity)
    } catch (e) {
      console.error(e)
      // showToast(TOASTS.general.genericError)
    }
  }, [baseEntityId, onUpdate, entityInstanceId])

  return deleteInstance
}

export const useModifyEntityInstance = (
  entityInstanceId: number,
  baseEntityId: number,
  formData?: Record<string, unknown>,
  onUpdate?: () => void
) => {
  // const showToast = useToast()

  const modifyInstance = useCallback(async () => {
    if (!baseEntityId) return
    const formDataAdj = formData
    const instance_id = entityInstanceId
    const isEdit = !!instance_id
    try {
      const query = isEdit
        ? API.editEntityInstance(baseEntityId, instance_id).query
        : API.createEntityInstance(baseEntityId).query
      const _res = (await query(formDataAdj))?.data
      await onUpdate?.()
      // if (instance_id) {
      //   updateEntityInstance(instance_id)
      // }
      // showToast(TOASTS.entities.successEditEntity)
      // if (!isEdit) {
      //   setFormData?.({})
      //   setOpenEntityInstanceForm(null)
      // }
    } catch (e) {
      // showToast(TOASTS.general.genericError)
      console.error(e)
    }
  }, [formData, baseEntityId, onUpdate, entityInstanceId])

  return modifyInstance
}
