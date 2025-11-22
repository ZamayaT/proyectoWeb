import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'
import coursesReducer from './reducers/coursesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
