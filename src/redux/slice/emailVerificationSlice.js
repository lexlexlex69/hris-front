import { createSlice } from "@reduxjs/toolkit";

export const emailVerificationSlice = createSlice({
    name:'emailVerification',
    initialState:{
        loading: false,
        login: {},
        error: '',
        email:''
    },
    reducers:{
        setEmail:(state,action) => {
            state.email = action.payload.target.value
        },
        getLoginVerified: () => { },
        loginVerifiedLoad: (state) => {
        return { ...state, loading: true }
        },
        loginVerifiedSuccess: (state, action) => {
        const login = action.payload
        return { ...state, loading: false, login: login }
        },
        loginVerifiedError: (state, action) => {
        const error = action.payload
        return { ...state, loading: false, error: error }
        }
    }
})
export const {setEmail,getLoginVerified,loginVerifiedLoad,loginVerifiedSuccess,loginVerifiedError} = emailVerificationSlice.actions;
export default emailVerificationSlice.reducer;