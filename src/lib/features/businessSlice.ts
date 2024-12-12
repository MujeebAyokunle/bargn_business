import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { axiosInstance } from '@/apis'

// Define a type for the slice state
export interface userState {
    userData: any
    businessDetails: any
    businessDetailsLoading: boolean
}

// Define the initial state using that type
const initialState: userState = {
    userData: {},
    businessDetails: {},
    businessDetailsLoading: false,
}

export const fetchBusinessDetailsThunk = createAsyncThunk("business/details", async () => {
    try {
        const response = await axiosInstance.get("business/details")

        return response.data
    } catch (error: any) {
        console.log(error.message)
    }
})

export const businessSlice = createSlice({
    name: 'business',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setUserData: (state, action: PayloadAction<number>) => {
            state.userData = action.payload
        },
        updateNotificationMode: (state, action) => {
            let { notification_method, value } = action.payload

            let temp = state.businessDetails
            temp[notification_method] = value

            state.businessDetails = { ...temp }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchBusinessDetailsThunk.pending, (state) => {
                state.businessDetailsLoading = true
            })
            .addCase(fetchBusinessDetailsThunk.fulfilled, (state, action) => {
                state.businessDetails = action.payload?.business

                state.businessDetailsLoading = false
            })
            .addCase(fetchBusinessDetailsThunk.rejected, (state) => {
                state.businessDetailsLoading = false
            })

    },
})

export const { setUserData, updateNotificationMode } = businessSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.business.value

export default businessSlice.reducer