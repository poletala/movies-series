import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./entity/user/slice";



const rootReducer = combineReducers({
    user: userReducer
})

export const store = configureStore({
    reducer: rootReducer
  
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch