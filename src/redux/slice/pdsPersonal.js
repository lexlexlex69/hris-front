import { createSlice } from '@reduxjs/toolkit'


export const pdsPersonal = createSlice({
  name: 'pdsPersonal',
  initialState: {
    loading: true,
    personal: {},
    personalToCompare:{},
    personalToUpdate:{},
    error: '',
    updateLoading: false,
    updateError: '',
  },
  reducers: {
    getPdsPersonal: () => { }, // trigger for fetching personal information
    pdsPersonalLoad: (state, action) => { 
      state.loading = true
    },
    pdsPersonalSuccess: (state, action) => {
      const personal = action.payload
      state.loading = false
      state.personal = personal
    },
    pdsPersonalError: (state, action) => {
      const error = action.payload
      state.loading = true
      state.error = error
    },
    PdsPersonalOnChange: (state, action) => {
      const { name, value } = action.payload
      state.personal[name] = value
      state.personalToUpdate[name] = value
    },
    PdsPersonalToUpdateClear:(state) => { // clear the toUpdate state
      state.personalToUpdate = {}
    },
    PdsPersonalUpdate: () => {}, // triggers when updating values of pds personal information
    getPdsPersonalWithUpdate: () => { }, // trigger for fetching personal information and the updates if updates is available
    pdsPersonalWithUpdateSuccess: (state,action) => { // fetch personal information data with the updates available in hris_info_update table
        const personalToCompare = action.payload
        state.personalToCompare = personalToCompare
    },
    PdsPersonalConfirmSuccess: (state,action) => { // if confirm is successful, delete the field in the toCompare state
        const field = action.payload
        delete state.personalToCompare[field.table_field]
        state.personal[field.table_field] = field.new_value
    }
  },
})

// Action creators are generated for each case reducer function
export const { getPdsPersonal,getPdsPersonalWithUpdate, pdsPersonalLoad, pdsPersonalSuccess, pdsPersonalError,PdsPersonalOnChange,PdsPersonalUpdate,PdsPersonalToUpdateClear,pdsPersonalWithUpdateSuccess,PdsPersonalConfirmSuccess } = pdsPersonal.actions

export default pdsPersonal.reducer