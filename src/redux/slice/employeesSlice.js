import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//   employee: undefined,
// }

export const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
      loading:false,
      employees: [],
      error:''
  },
  reducers: {
    getEmployees: () => {},
    employeesLoad: (state) => {
        return {...state,loading:true}
    },
    employeesSuccess: (state,action) => {
        const employees = action.payload
        return {...state,loading:false,employees:employees}
    },
    employeesError: (state,action) => {
        const error = action.payload
        return {...state,loading:false,employees:{},error:error}
    },
  },
})

// Action creators are generated for each case reducer function
export const { getEmployees,employeesLoad,employeesSuccess,employeesError } = employeesSlice.actions

export default employeesSlice.reducer