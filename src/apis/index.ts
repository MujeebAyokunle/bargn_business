import { signinDataTypes } from "@/types";
import Cookies from 'js-cookie';
import axios from "axios";

// Create an axios instance
export const axiosInstance = axios.create({
    baseURL: 'https://52.90.12.51.nip.io/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Check for token only in the browser environment
if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
}

export const signInApi = async (json: signinDataTypes, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.post("/business/login", json)

        const token = response.data.token;

        localStorage.setItem("authToken", token);

        Cookies.set('token', token, { expires: 7, path: '/' });

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        cb(response?.data || response)
    } catch (error: any) {
        console.log("error", error?.response?.data)

        cb(error?.response?.data || error?.message)
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

        const token = response.data?.authtoken;

        Cookies.set('token', token, { expires: 7, path: '/' });

        localStorage.setItem("authToken", token);

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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

export const fetchDealsApi = async (json: { page_number: number, status: string }, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.get("/business/deals", {
            params: json
        })

        cb(response?.data || response)
    } catch (error: any) {
        console.log("error", error?.response?.data)
        cb(error.response.data)
    }
}

export const createDealApi = async (json: any, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.post("/business/deals", json, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        cb(response?.data || response)
    } catch (error: any) {
        console.log("error", error?.response?.data)
        cb(error.response.data)
    }
}

export const fetchDealDraftApi = async (cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.get("/business/deals/draft")

        cb(response?.data || response)
    } catch (error: any) {
        console.log("error", error?.response?.data)
        cb(error.response.data)
    }
}

export const fetchSingleDraftApi = async (param: { id: string }, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.get("/business/draft", {
            params: param
        })

        cb(response?.data || response)
    } catch (error: any) {
        console.log("error", error?.response?.data)
        cb(error.response.data)
    }
}

export const createDealDraftApi = async (json: any, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.post("/business/deals/draft", json)

        cb(response?.data || response)
    } catch (error: any) {
        console.log("error", error?.response?.data)
        cb(error.response.data)
    }
}

export const getCoordinateApi = async (place_id: string, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.post("/business/coordinate", {
            place_id
        })

        cb(response?.data || response)
    } catch (error: any) {
        console.log("get coordinate error", error.message)
        return {
            error: true,
            message: error?.response?.data
        }
    }
}

export const getchRedeemedDeals = async (json: { page_number: number, search_text: string }, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.get("/business/redeemeddeals", {
            params: json
        })

        cb(response?.data || response)
    } catch (error: any) {
        console.log("get coordinate error", error.message)
        return {
            error: true,
            message: error?.response?.data
        }
    }
}

export const fetchBusinessDetails = async (cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.get("/business/details")

        cb(response?.data || response)
    } catch (error: any) {
        console.log("get business details error", error.message)
        return {
            error: true,
            message: error?.response?.data
        }
    }
}

export const UpdateMessageNotificationApi = async (json: { value: boolean, notification_medium: string }, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.post("/business/notification", json)

        cb(response?.data || response)
    } catch (error: any) {
        console.log("get notification method error", error.message)
        return {
            error: true,
            message: error?.response?.data
        }
    }
}

export const UpdateLanguageApi = async (json: { language: string }, cb: (param: any) => void) => {
    try {
        const response = await axiosInstance.post("/business/language", json)

        cb(response?.data || response)
    } catch (error: any) {
        console.log("update language error", error.message)
        return {
            error: true,
            message: error?.response?.data
        }
    }
}