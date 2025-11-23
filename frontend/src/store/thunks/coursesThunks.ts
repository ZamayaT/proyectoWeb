import type { AppDispatch } from '../../store/store'
import coursesService from '../../services/courses'
import { setCourses, setLoading, setError } from '../reducers/coursesSlice'

export const fetchCourses = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    try {
      const data = await coursesService.getAll()
      dispatch(setCourses(data))
    } catch (err: any) {
      dispatch(setError(err?.message || 'Error al obtener ramos'))
    } finally {
      dispatch(setLoading(false))
    }
  }
}
