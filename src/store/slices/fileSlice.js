import { createSlice } from "@reduxjs/toolkit";
import { deleteFile, getAllFiles, uploadFile } from "../thunks/fileThunk";

const fileSlice = createSlice({
  name: "file",
  initialState: {
    files: [],
  },
  extraReducers(builder) {
    //upload files
    builder.addCase(uploadFile.fulfilled, (state, action) => {
      state.files.push(action.payload);
    });

    //delete file
    builder.addCase(deleteFile.fulfilled, (state, action) => {
      const id = action.payload._id;
      state.files = state.files.filter((file) => file._id !== id);
    });

    //get all files
    builder.addCase(getAllFiles.fulfilled, (state, action) => {
      state.files = action.payload;
    });
  },
});

export const fileReducer = fileSlice.reducer;
