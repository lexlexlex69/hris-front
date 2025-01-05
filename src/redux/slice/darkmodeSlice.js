import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//   value: false,
// }

export const darkmodeSlice = createSlice({
  name: 'darkmode',
  initialState: {value: false},
  reducers: {
    darkmode: (state) => {
      return {...state,value:!state.value}
    },
  },
})

// Action creators are generated for each case reducer function
export const { darkmode } = darkmodeSlice.actions

export default darkmodeSlice.reducer