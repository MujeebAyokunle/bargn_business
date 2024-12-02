import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
export interface userState {
    userData: any
}

// Define the initial state using that type
const initialState: userState = {
    userData: {}
}

export const businessSlice = createSlice({
    name: 'business',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setUserData: (state, action: PayloadAction<number>) => {
            state.userData = action.payload
        }
    }
})

export const { setUserData } = businessSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.business.value

export default businessSlice.reducer