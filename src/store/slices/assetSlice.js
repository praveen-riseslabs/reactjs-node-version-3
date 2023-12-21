import { createSlice } from "@reduxjs/toolkit";
import {
  createNewAsset,
  deleteAsset,
  getAllAssets,
  getAllTrashedAssets,
  restoreAsset,
  trashAsset,
  updateAsset,
} from "../thunks/assetThunk";

const assetSlice = createSlice({
  name: "asset",
  initialState: {
    assets: [],
    trashedAssets: [],
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

    //get all the trashed assets
    builder.addCase(getAllTrashedAssets.fulfilled, (state, action) => {
      state.trashedAssets = action.payload;
    });

    //delete asset permanently
    builder.addCase(deleteAsset.fulfilled, (state, action) => {
      state.trashedAssets = state.trashedAssets.filter(
        (asset) => asset._id !== action.payload._id
      );
    });

    //trash asset
    builder.addCase(trashAsset.fulfilled, (state, action) => {
      state.assets = state.assets.filter(
        (asset) => asset._id !== action.payload._id
      );
    });

    //restore assets from trash
    builder.addCase(restoreAsset.fulfilled, (state, action) => {
      state.trashedAssets = state.trashedAssets.filter(
        (asset) => asset._id !== action.payload._id
      );
      state.assets.unshift(action.payload);
    });

    //update asset
    builder.addCase(updateAsset.fulfilled, (state, action) => {
      state.assets = state.assets.map((asset) =>
        asset._id === action.payload._id ? {...asset, ...action.payload} : asset
      );
    });
  },
});

export const assetReducer = assetSlice.reducer;
