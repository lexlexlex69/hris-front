import {createSlice} from '@reduxjs/toolkit'

export const pdsVoluntary = createSlice({
    name:'pdsVoluntary',
    initialState: {
        loading: true,
        voluntary: [{}],
        error: ''
    },
    reducers: {
        getPdsVoluntary: () => {},
        pdsVoluntaryLoad: (state) => {
            state.loading = true
        },
        pdsVoluntarySuccess: (state,action) => {
            const voluntary = action.payload
            state.loading = false
            state.voluntary = voluntary
        },
        pdsVoluntaryError: (state,action) => {
            const error = action.payload
            state.loading = true
            state.error = error
        },
    }
});

export const {getPdsVoluntary,pdsVoluntaryLoad,pdsVoluntarySuccess,pdsVoluntaryError} = pdsVoluntary.actions

export default pdsVoluntary.reducer