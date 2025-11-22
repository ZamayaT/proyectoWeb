import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Ramo } from '../../Types'

interface CoursesState {
  courses: Ramo[]
  loading: boolean
  error: string | null
}

const initialState: CoursesState = {
  courses: [],
  loading: false,
  error: null,
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses(state, action: PayloadAction<Ramo[]>) {
      state.courses = action.payload
      state.error = null
    },
    addCourse(state, action: PayloadAction<Ramo>) {
      state.courses.push(action.payload)
    },
    removeCourse(state, action: PayloadAction<string>) {
      state.courses = state.courses.filter(c => c.id !== action.payload)
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const { setCourses, addCourse, removeCourse, setLoading, setError } = coursesSlice.actions
export default coursesSlice.reducer
