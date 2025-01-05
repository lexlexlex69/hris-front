import {createSlice} from '@reduxjs/toolkit'

export const pdsOthersChecklist = createSlice({
    name:'pdsOthersChecklist',
    initialState: {
        checklist: {},
        loading: true,
        error: ''
    },
    reducers: {
        getPdsOthersChecklist: () => {},
        pdsOthersChecklistLoad: (state) => {
            state.loading = true
        },
        pdsOthersChecklistSuccess: (state,action) => {
            const checklist = action.payload
            state.loading = false
            state.checklist = checklist
        },
        pdsOthersChecklistError: (state,action) => {
            const error = action.payload
            state.loading = false
            state.checklist = error
        },
    }
})

export const {getPdsOthersChecklist,pdsOthersChecklistLoad,pdsOthersChecklistSuccess,pdsOthersChecklistError} = pdsOthersChecklist.actions

export default pdsOthersChecklist.reducer