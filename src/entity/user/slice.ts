import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SetUserPayload = {
    id: number
    name: string
    email: string
    password: string
}
type UserState = {
    id: number | null
    name: string | null
    password: string | null
    email: string | null
}
const initialState: UserState = {
    id: null,
    password: null,
    email: null,
    name: null
}
const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<SetUserPayload>) => {
            state = action.payload
            return state
        },
        clearUser: () => {
            return initialState
        }
    }
})

export const userActions = slice.actions
export const userReducer = slice.reducer