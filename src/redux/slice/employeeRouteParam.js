import { createSlice } from "@reduxjs/toolkit";

export const employeeRouteParam = createSlice({
    name: 'employeeRouteParam',
    initialState: {
        param:''
    },
    reducers: {
        employeeRouteParamCall: () => {},
        employeeRouteParamChange: (state,action) => {
            const param = action.payload
            state.param = param
        }
    }
})

export const {employeeRouteParamCall,employeeRouteParamChange} = employeeRouteParam.actions

export default employeeRouteParam.reducer