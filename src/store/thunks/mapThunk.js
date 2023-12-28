import { createAsyncThunk } from "@reduxjs/toolkit";
import { mapApi } from "../api/map";

//send latest coords
const sendCoords = createAsyncThunk("send/coords", async (data) => {
  try {
    await mapApi.post("/send", data);
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

//fetching coords
const fetchCoords = createAsyncThunk("fetch/coords", async (date) => {
  try {
    const doc = await mapApi.get(
      "/",
      {
        params: {
          date: date,
        },
      }
    );
    return doc.data;
  } catch (err) {
    throw Error(err.response.data.error);
  }
});

export { sendCoords, fetchCoords };
