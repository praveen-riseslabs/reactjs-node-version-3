import { configureStore } from "@reduxjs/toolkit";
import { userReducer, logoutUser } from "./slices/userSlice";


const store = configureStore({
    reducer:{
        user: userReducer
    }
})

export {store, logoutUser}

export * from "./thunks/userThunk"