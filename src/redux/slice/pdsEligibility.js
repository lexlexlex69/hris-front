import {createSlice} from '@reduxjs/toolkit'

export const pdsEligibility = createSlice({
    name:'pdsEligibility',
    initialState: {
        loading: true,
        eligibility: [{}],
        error: '',
        updateLoading: false,
        updateError: ''
    },
    reducers: {
        getPdsEligibility: () => {},
        pdsEligibilityLoad: (state) => {
            return {...state,loading:true}
        },
        pdsEligibilitySuccess: (state,action) => {
            const eligibility = action.payload
            return {...state,loading:false,eligibility:eligibility}
        },
        pdsEligibilityError: (state,action) => {
            const error = action.payload
            return {...state,loading:true,error:error}
        }
    }
})
export const {getPdsEligibility,pdsEligibilityLoad,pdsEligibilitySuccess,pdsEligibilityError} = pdsEligibility.actions
export default pdsEligibility.reducer