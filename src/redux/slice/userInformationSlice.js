import { createSlice } from "@reduxjs/toolkit";

export const userInformationSlice = createSlice({
    name:'userInformation',
    initialState:{
        userinfo:{

        },
        hasPDS:null,
        profile:{

        },
        updatePasswordSuccess:null
    },
    reducers:{
        getInfo:() => {
            
        },
        destroyInfo: (state)=>{
            state.userinfo = {}
        },
        getInfoSuccess:(state,action)=>{
            const profile = action.payload
            return {...state,userinfo:profile}
        },
        getHasPDS:()=>{
        },
        hasPDSSuccess:(state,action) => {
            state.hasPDS = action.payload
        },
        getUserProfile:()=>{
        },
        getUserProfileSuccess:(state,action) => {
            state.profile = action.payload
        },
        updateUserPassword:()=>{
            
        },
        updateUserPasswordSuccess:(state,action) => {
            const update = action.payload
            return {...state,updatePasswordSuccess:update}
        }
    }
})
export const {getInfo,getInfoSuccess,destroyInfo,getHasPDS,hasPDSSuccess,getUserProfile,getUserProfileSuccess,updateUserPassword,updateUserPasswordSuccess} = userInformationSlice.actions;

export default userInformationSlice.reducer