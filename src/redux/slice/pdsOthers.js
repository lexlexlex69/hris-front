import {createSlice} from '@reduxjs/toolkit'

export const pdsOthers = createSlice({
    name: 'pdsOthers',
    initialState: {
        others: {},
        loading: true,
        error: '',
    },
    reducers: {
        getPdsOthers: () => {},
        pdsOthersInfoLoad: (state,action) => {
            state.loading = true
        },
        pdsOthersInfoSuccess: (state,action) => {
            const others = action.payload
            state.loading = false
            state.others = others
        },
        pdsOthersInfoError: (state,action) => {
            const error = action.payload
            state.loading = false
            state.error = error
        }
    }
})
export const {getPdsOthers,pdsOthersInfoLoad,pdsOthersInfoSuccess,pdsOthersInfoError} = pdsOthers.actions
export default pdsOthers.reducer