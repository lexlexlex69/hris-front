import { createSlice } from "@reduxjs/toolkit";

export const userRegistrationSlice = createSlice({
    name:'userInformation',
    initialState:{
        userinfo:{
        }
    },
    reducers:{
        setInfo:(state,action) => {
            state.userinfo = action.payload
        },
        getInfo:(state)=>{
            return state.userinfo
        }
    }
})
export const {setInfo,getInfo} = userRegistrationSlice.actions;

export default userRegistrationSlice.reducer