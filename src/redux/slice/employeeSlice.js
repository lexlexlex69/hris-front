import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//   employee: undefined,
// }

export const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    loading: true,
    employee: {},
    error: '',
    updateLoading: false,
    updateError: '',
    temp_fname: '',
    temp_mname: '',
    temp_lname: ''
  },
  reducers: {
    getEmployee: () => { },
    employeeLoad: (state, action) => {
      const employee = action.payload
      return { ...state, loading: true }
    },
    employeeSuccess: (state, action) => {
      const employee = action.payload
      return { ...state, loading: false, employee: employee, temp_fname: employee.fname, temp_mname: employee.mname, temp_lname: employee.lname }
    },
    employeeError: (state, action) => {
      const error = action.payload
      return { ...state, loading: false, error: error, temp_fname: null, temp_mname: null, temp_lname: null }
    },
    employeeOnChange: (state, action) => {
      const { name, value } = action.payload
      state.employee[name] = value
    },
    employeeUpdate: () => {},
    employeeUpdateLoad: (state, action) => {
      const employee = action.payload
      return { ...state, updateLoading: true }
    },
    employeeUpdateSuccess: (state, action) => {
      const employee = action.payload
      return { ...state, updateLoading: false, employee: employee, temp_fname: employee.fname, temp_mname: employee.mname, temp_lname: employee.lname }
    },
    employeeUpdateError: (state, action) => {
      const error = action.payload
      return { ...state, updateLoading: false, error: error, temp_fname: null, temp_mname: null, temp_lname: null }
    },
  },
})

// Action creators are generated for each case reducer function
export const { getEmployee, employeeLoad, employeeSuccess, employeeError, employeeOnChange,employeeUpdate,employeeUpdateLoad,employeeUpdateSuccess,employeeUpdateError } = employeeSlice.actions

export default employeeSlice.reducer