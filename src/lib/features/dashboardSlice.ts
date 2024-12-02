import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { axiosInstance } from '@/apis'

// Define a type for the slice state
export interface userState {
    dashboardData: any
    dashboardSales: any
    loading: boolean
    loadingMore: boolean
}

// Define the initial state using that type
const initialState: userState = {
    dashboardData: {},
    dashboardSales: [],
    loading: false,
    loadingMore: false
}

export const fetchDashboardData = createAsyncThunk("dashboard/fetch", async () => {
    try {
        const response = await axiosInstance.get("/business/dashboard")

        return response?.data || response
    } catch (error: any) {
        console.log("fetch dashboard data error", error.message)
    }
})

export const fetchPagedDashboardSalesData = createAsyncThunk("sales/more", async (pageNumber: number) => {
    try {
        const response = await axiosInstance.get("/business/dashboardsales", {
            params: {
                pageNumber
            }
        })

        return response?.data || response
    } catch (error: any) {
        console.log("fetch dashboard data error", error.message)
    }
})

export const dashboardSlice = createSlice({
    name: 'dashboard',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false
                state.dashboardData = action.payload
                state.dashboardSales = action.payload?.salesDeals
            })
            .addCase(fetchDashboardData.rejected, (state) => {
                state.loading = false
            })
            .addCase(fetchPagedDashboardSalesData.pending, (state) => {
                state.loadingMore = true
            })
            .addCase(fetchPagedDashboardSalesData.fulfilled, (state, action) => {
                state.loadingMore = false
                state.dashboardSales = action.payload?.salesDeals
            })
            .addCase(fetchPagedDashboardSalesData.rejected, (state) => {
                state.loadingMore = false
            })
    },
})

// export const { setUserData } = dashboardSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.business.value

export default dashboardSlice.reducer