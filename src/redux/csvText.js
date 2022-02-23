import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  text: null
};

export const csvTextSlice = createSlice({
  name: "csvText",
  initialState,
  reducers: {
    updateText: (state, action) => {
      state.text = action.payload
    }
  }
});

export const { updateText } = csvTextSlice.actions;
export default csvTextSlice.reducer;
