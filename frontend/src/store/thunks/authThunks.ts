import type { AppDispatch } from '../../store/store'
import loginService from '../../services/login'
import { setUser, setLoading, setError, clearUser } from '../reducers/authSlice'

export const restoreLogin = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    try {
      const user = await loginService.restoreLogin()
      if (user) dispatch(setUser(user))
      else dispatch(clearUser())
    } catch (err: any) {
      dispatch(setError(err?.message || 'Error al restaurar sesión'))
    } finally {
      dispatch(setLoading(false))
    }
  }
}

export const login = (credentials: { username: string; password: string }) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    try {
      await loginService.login(credentials)
      const user = await loginService.restoreLogin()
      if (user) dispatch(setUser(user))
      else dispatch(setError('No se pudo obtener el usuario'))
    } catch (err: any) {
      dispatch(setError(err?.response?.data?.error || err?.message || 'Error en login'))
    } finally {
      dispatch(setLoading(false))
    }
  }
}

export const logout = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    try {
      await loginService.logout()
      dispatch(clearUser())
    } catch (err: any) {
      dispatch(setError(err?.message || 'Error al cerrar sesión'))
    } finally {
      dispatch(setLoading(false))
    }
  }
}
