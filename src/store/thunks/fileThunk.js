import { createAsyncThunk } from "@reduxjs/toolkit";
import { fileApi } from "../api/file";

//uploading files
const uploadFile = createAsyncThunk("file/upload", async (fileData) => {
  try {
    const uploadFile = await fileApi.post("/upload", fileData);
    return uploadFile.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//deleting files
const deleteFile = createAsyncThunk("file/delete", async (id) => {
  try {
    const removedFile = await fileApi.delete(`/remove/${id}`);

    return removedFile.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//getting all files
const getAllFiles = createAsyncThunk("file/all", async () => {
  try {
    const files = await fileApi.get("/");
    return files.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

export { uploadFile, deleteFile, getAllFiles };
