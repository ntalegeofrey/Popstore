import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserInfo: (state, action) => {
      state.userInfo = JSON.stringify(action.payload)
    }
  }
});

export const { addUserInfo } = userSlice.actions;
export default userSlice.reducer;
