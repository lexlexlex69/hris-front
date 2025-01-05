import { createSlice } from "@reduxjs/toolkit";

export const pdsWorkExp = createSlice({
    name:'pdsWorkExp',
    initialState: {
        loading:true,
        workExp: [{}],
        error: ''
    },
    reducers: {
        getPdsWorkExp: () => {},
        pdsWorkExpLoad: (state) => {
            state.loading = true
        },
        pdsWorkExpSuccess: (state,action) => {
            const workExp = action.payload
            state.loading = false
            state.workExp = workExp
        },
        pdsWorkExpError: (state,action) => {
            const error = action.payload
            state.loading = false
            state.error = error
        }
    }
})

export const {getPdsWorkExp,pdsWorkExpLoad,pdsWorkExpSuccess,pdsWorkExpError} = pdsWorkExp.actions
export default pdsWorkExp.reducer