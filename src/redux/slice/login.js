import { createSlice } from '@reduxjs/toolkit'

export const login = createSlice({
  name: 'login',
  initialState: {
    loading: false,
    login: {},
    error: '',
  },
  reducers: {
    getLogin: () => { },
    loginLoad: (state) => {
      return { ...state, loading: true }
    },
    loginSuccess: (state, action) => {
      const login = action.payload
      return { ...state, loading: false, login: login }
    },
    loginError: (state, action) => {
      const error = action.payload
      return { ...state, loading: false, error: error }
    }
  },
})

// Action creators are generated for each case reducer function
export const { getLogin, loginLoad, loginSuccess, loginError } = login.actions

export default login.reducer