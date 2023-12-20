import { createSlice } from "@reduxjs/toolkit";
import { createNewAsset, getAllAssets } from "../thunks/assetThunk";

const assetSlice = createSlice({
  name: "asset",
  initialState: {
    assets: [],
  },
  extraReducers(builder) {
    //create a new asset
    builder.addCase(createNewAsset.fulfilled, (state, action) => {
      state.assets.unshift(action.payload);
    });

    //get all the assets
    builder.addCase(getAllAssets.fulfilled, (state, action) => {
      state.assets = action.payload;
    });
  },
});

export const assetReducer = assetSlice.reducer;
