import { createSlice } from '@reduxjs/toolkit'

export const logout = createSlice({
  name: 'logout',
  initialState: {
    loading: false,
    login: {},
    error: '',
  },
  reducers: {
    getLogout: () => { },
  },
})

// Action creators are generated for each case reducer function
export const { getLogout} = logout.actions

export default logout.reducer