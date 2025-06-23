export const a = 1
/*
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  updateEntityModel,
  updateStructuredJoiningsModel,
} from '../../store/reducers/entityModelReducer'
import { getStructuredEntityJoinings } from 'common/entity_model'
import { API } from '../API'

export const useEntityModel = (currentBaseEntityId: number | undefined) => {
  const { entity_fields, entity_joinings } = useAppSelector(
    (state: any) => state.entityModelReducer.entityModel
  )
  const dispatch = useAppDispatch()
  const updateDataModel = React.useCallback(async () => {
    try {
      const data = null
      // const data = (
      //   await API.entityModel.query(undefined, undefined, undefined, {
      //     disableRedirectToLogin: true,
      //   })
      // )?.data
      if (!data) throw new Error('No data')
      dispatch(updateEntityModel(data))
    } catch (e) {
      console.error(e)
    }
  }, [dispatch])

  React.useEffect(
    () => {
      updateDataModel()
    },
    // run only once at start
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  React.useEffect(() => {
    const fetchJoiningsStructure = async () => {
      if (
        !currentBaseEntityId ||
        !entity_fields?.length ||
        !entity_joinings?.length
      )
        return
      const structuredEntityJoinings = await getStructuredEntityJoinings(
        currentBaseEntityId,
        entity_fields,
        entity_joinings
      )
      dispatch(updateStructuredJoiningsModel(structuredEntityJoinings))
    }
    fetchJoiningsStructure()
  }, [currentBaseEntityId, entity_fields, entity_joinings, dispatch])

  return { updateDataModel }
}
*/
