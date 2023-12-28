import { createSlice } from "@reduxjs/toolkit";
import { fetchCoords } from "../thunks/mapThunk";

const mapSlice = createSlice({
  name: "map",
  initialState: {
    coords: {},
  },
  extraReducers(builder) {
    //fetching coords
    builder.addCase(fetchCoords.fulfilled, (state, action) => {
      state.coords = action.payload;
    });
  },
});

export const mapReducer = mapSlice.reducer;
