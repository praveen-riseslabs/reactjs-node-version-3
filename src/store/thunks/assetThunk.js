import { createAsyncThunk } from "@reduxjs/toolkit";
import { assetApi } from "../api/asset";

//create new asset
const createNewAsset = createAsyncThunk("asset/create", async (data) => {
  try {
    const newAsset = await assetApi.post("/create", data);

    return newAsset.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//get all assets
const getAllAssets = createAsyncThunk("fetch/assets", async () => {
  try {
    const newAsset = await assetApi.get("/");

    return newAsset.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//get all trashed assets
const getAllTrashedAssets = createAsyncThunk(
  "fetch/trashedAssets",
  async (trashed) => {
    try {
      const newAsset = await assetApi.get("/", {
        params: { trashed },
      });

      return newAsset.data;
    } catch (err) {
      throw Error(err.response.data.error);
    }
  }
);

//delete asset permanently
const deleteAsset = createAsyncThunk("asset/delete", async (assetId) => {
  try {
    const newAsset = await assetApi.delete(`/delete/${assetId}`);

    return newAsset.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//trash asset
const trashAsset = createAsyncThunk("asset/trash", async (assetId) => {
  try {
    const newAsset = await assetApi.put(`/trash/${assetId}`);

    return newAsset.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//restoring asset from trash
const restoreAsset = createAsyncThunk("asset/restore", async (assetId) => {
  try {
    const newAsset = await assetApi.put(`/restore/${assetId}`);

    return newAsset.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//updating asset
const updateAsset = createAsyncThunk("asset/update", async (data) => {
  try {
    const newAsset = await assetApi.put("/update", data);

    return newAsset.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

export {
  createNewAsset,
  getAllAssets,
  deleteAsset,
  trashAsset,
  restoreAsset,
  getAllTrashedAssets,
  updateAsset,
};
