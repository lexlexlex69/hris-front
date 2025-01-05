import { createSlice } from "@reduxjs/toolkit";

export const applicantPdsSlice = createSlice({
    name:'applicantpds',
    initialState:{
        loading:true,
        personal:{

        },
        error:'',
        
    },
    reducers:{
        getPdsPersonal:()=>{},
        getpdsPersonalLoad: (state,action) => {
            state.loading = true
        },
        pdsPersonalSuccess:(state,action)=>{
            state.personal = action.payload
            state.loading = false
        },
        pdsPersonalError:(state,action)=>{
            state.error = action.payload
        },
    }
})
export const {getPdsPersonal,getpdsPersonalLoad,pdsPersonalError,pdsPersonalSuccess} = applicantPdsSlice.actions;
export default applicantPdsSlice.reducer;