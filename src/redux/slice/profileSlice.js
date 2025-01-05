import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
    name:'profile',
    initialState:{
        loading:true,
        profile:{

        },
        updateLoading:true,
        error:''
    },
    reducers:{
        getProfile: ()=>{

        },
        profileLoad:(state,action) =>{
            const profile = action.payload
            return {...state,loading:true}
        },
        profileSucces:(state,action)=>{
            const profile = action.payload
            return {...state,profile:profile,loading:false}
        },
        profileError:(state,action)=>{
            const error = action.payload
            return {...state,loading:false,error:error}
        }

    }
})
export const {getProfile,profileLoad,profileSucces,profileError} = profileSlice.actions;

export default profileSlice.reducer