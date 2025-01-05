import {createSlice} from '@reduxjs/toolkit'

export const pdsCommon = createSlice({
    name:'pdsCommon',
    initialState:{
        load: false
    },
    reducers: {
        pdsConfirm: () => {},
        pdsConfirmLoad:(state) => {
            state.load = true
        },
        pdsConfirmSuccess:(state) => {
            state.load = false
        }
    }
})

export const {pdsConfirm,pdsConfirmLoad,pdsConfirmSuccess} = pdsCommon.actions

export default pdsCommon.reducer