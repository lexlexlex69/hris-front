import {createSlice} from '@reduxjs/toolkit'

export const pdsTrainings = createSlice({
    name: 'pdsTraining',
    initialState: {
        loading:true,
        trainings: [{}],
        error: ''
    },
    reducers: {
        getPdsTrainings: () => {},
        pdsTrainingsLoad: (state) => {
            state.loading = true
        },
        pdsTrainingsSuccess: (state,action) => {
            const trainings = action.payload
            state.loading = true
            state.trainings = trainings
        },
        pdsTrainingsError: (state,action) => {
            const error = action.payload
            state.loading = false
            state.error = error
        }
    }
})

export const {getPdsTrainings,pdsTrainingsLoad,pdsTrainingsSuccess,pdsTrainingsError} = pdsTrainings.actions

export default pdsTrainings.reducer