import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'
import coursesReducer from './reducers/coursesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
  },
})

export default store
