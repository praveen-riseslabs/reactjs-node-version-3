import { createAsyncThunk } from "@reduxjs/toolkit";
import { assetApi } from "../api/asset";

const createNewAsset = createAsyncThunk("asset/create", async (data) => {
  try {
    const newAsset = await assetApi.post("/create", data);

    return newAsset.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

const getAllAssets = createAsyncThunk("fetch/assets", async () => {
  try {
    const newAsset = await assetApi.get("/");

    return newAsset.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

export { createNewAsset, getAllAssets };
