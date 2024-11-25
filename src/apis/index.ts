import { signinDataTypes } from "@/types";
import axios from "axios";

// Create an axios instance
export const axiosInstance = axios.create({
    baseURL: 'https://52.90.12.51.nip.io/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const signInApi = async (json: signinDataTypes, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.post("/business/login", json)

        const token = response.data.token;

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        cb(response?.data || response)
    } catch (error: any) {
        console.log("error", error?.response?.data)
        cb(error.response.data)
    }
}

export const signUpApi = async (json: signinDataTypes, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.post("/business/create_account", json)

        cb(response?.data || response)
    } catch (error: any) {
        console.log("error", error?.response?.data)
        cb(error.response.data)
    }
}

export const sendResetPasswordOtpApi = async (json: { registered_email: string }, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.post("/business/password_reset_url", json)

        cb(response?.data || response)
    } catch (error: any) {
        console.log("error", error?.response?.data)
        cb(error.response.data)
    }
}

export const completeProfileApi = async (json: any, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.post("/business/complete_profile", json)

        cb(response?.data || response)
    } catch (error: any) {
        console.log("error", error?.response?.data)
        cb(error.response.data)
    }
}

export const fetchCategoriesApi = async (cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.get("/categories")

        cb(response?.data || response)
    } catch (error: any) {
        console.log("error", error?.response?.data)
        cb(error.response.data)
    }
}

export const resendAccountVerificationApi = async (json: { email: string }, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.post("/account_verification/resend", json)

        cb(response?.data || response)
    } catch (error: any) {
        console.log("error", error?.response?.data)
        cb(error.response.data)
    }
}