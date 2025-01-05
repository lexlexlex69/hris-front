import { createSlice } from '@reduxjs/toolkit'


export const pdsFamilyBackground = createSlice({
  name: 'pdsFamilyBackground',
  initialState: {
    loading: true,
    familyBackgroundToCompare: {},
    familyBackgroundToUpdate:{},
    familyBackground: {},
    error: '',
    updateLoading: false,
    updateError: '',
  },
  reducers: {
    getPdsFamilyBackground: () => { },
    pdsFamilyBackgroundLoad: (state, action) => {
      const familyBackground = action.payload
      return { ...state, loading: true }
    },
    pdsFamilyBackgroundSuccess: (state, action) => {
      const familyBackground = action.payload
      return { ...state, loading: false, familyBackground: familyBackground }
    },
    pdsFamilyBackgroundError: (state, action) => {
      const error = action.payload
      return { ...state, loading: true, error: error }
    },
    PdsFamilyBackgroundOnChange: (state, action) => {
      const { name, value } = action.payload
      state.familyBackground[name] = value
      state.familyBackgroundToUpdate[name] = value
    },
    PdsFamilyBackgroundUpdate: () => {},
    getFamilyBackgroundWithUpdate: () => {}, // trigger for fetching family background and the updates if updates is available
    pdsFamilyBackgroundWithUpdateSuccess: (state,action) => { // fetch family background data with the updates available in hris_info_update table
        const familyBackgroundToCompare = action.payload
        state.familyBackgroundToCompare = familyBackgroundToCompare
    },
    PdsFamilyBackgroundConfirmSuccess: (state,action) => { // if confirm is successful, delete the field in the toCompare state
        const field = action.payload
        delete state.personalToCompare[field.table_field]
        state.personal[field.table_field] = field.new_value
    }
    // PdsFamilyBackgroundUpdateLoad: (state, action) => {
    //   const employee = action.payload
    //   return { ...state, updateLoading: true }
    // },
    // PdsFamilyBackgroundUpdateSuccess: (state, action) => {
    //   const employee = action.payload
    //   return { ...state, updateLoading: false, employee: employee, temp_fname: employee.fname, temp_mname: employee.mname, temp_lname: employee.lname }
    // },
    // PdsFamilyBackgroundUpdateError: (state, action) => {
    //   const error = action.payload
    //   return { ...state, updateLoading: false, error: error, temp_fname: null, temp_mname: null, temp_lname: null }
    // },
  },
})

// Action creators are generated for each case reducer function
export const { getPdsFamilyBackground, pdsFamilyBackgroundLoad, pdsFamilyBackgroundSuccess, pdsFamilyBackgroundError, PdsFamilyBackgroundOnChange,PdsFamilyBackgroundUpdate,getFamilyBackgroundWithUpdate,pdsFamilyBackgroundWithUpdateSuccess,PdsFamilyBackgroundConfirmSuccess } = pdsFamilyBackground.actions

export default pdsFamilyBackground.reducer