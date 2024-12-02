import { combineReducers, configureStore } from '@reduxjs/toolkit'
import businessReducer from './features/businessSlice'
// import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';
import dashboardReducer from './features/dashboardSlice';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const rootReducer = combineReducers({
    business: businessReducer,
    dashboard: dashboardReducer
});

const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null);
        },
        setItem() {
            return Promise.resolve();
        },
        removeItem() {
            return Promise.resolve();
        },
    };
};

const storage =
    typeof window !== "undefined"
        ? createWebStorage("local")
        : createNoopStorage();

// Redux Persist configuration
const persistConfig = {
    key: 'root', // Key for localStorage
    storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const makeStore = () => {
    return configureStore({
        reducer: persistedReducer, // Use the persisted reducer
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false, // Disable serialization check for redux-persist
            }),
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']