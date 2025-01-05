import { createSlice } from '@reduxjs/toolkit'


export const pdsEducation = createSlice({
  name: 'pdsEducation',
  initialState: {
    loading: true,
    education: {},
    error: '',
    updateLoading: false,
    updateError: '',
  },
  reducers: {
    getPdsEducation: () => { },
    pdsEducationLoad: (state) => {
      // return { ...state, loading: true }
      state.loading = true
    },
    pdsEducationSuccess: (state, action) => {
      const education = action.payload
      // return { ...state, loading: false, education: education }
      state.loading = false
      state.education = education
    },
    pdsEducationError: (state, action) => {
      const error = action.payload
      return { ...state, loading: true, error: error }
    },
    PdsPersonalOnChange: (state, action) => {
      const { name, value } = action.payload
      state.employee[name] = value
    },
    PdsPersonalUpdate: () => {},
    PdsPersonalUpdateLoad: (state, action) => {
      const employee = action.payload
      return { ...state, updateLoading: true }
    },
    PdsPersonalUpdateSuccess: (state, action) => {
      const employee = action.payload
      return { ...state, updateLoading: false, employee: employee, temp_fname: employee.fname, temp_mname: employee.mname, temp_lname: employee.lname }
    },
    PdsPersonalUpdateError: (state, action) => {
      const error = action.payload
      return { ...state, updateLoading: false, error: error, temp_fname: null, temp_mname: null, temp_lname: null }
    },
  },
})

// Action creators are generated for each case reducer function
export const { getPdsEducation, pdsEducationLoad, pdsEducationSuccess, pdsEducationError } = pdsEducation.actions

export default pdsEducation.reducer