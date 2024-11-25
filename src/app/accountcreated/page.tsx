"use client"
import { resendAccountVerificationApi } from '@/apis'
import { errorToast, successToast } from '@/helper/functions'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function AccountCreated() {

    const [email, setEmail] = useState("")

    useEffect(() => {
        let temp = window.sessionStorage.getItem("email")
        setEmail(temp || "")
    }, [])

    const resendVerificationEmail = async () => {
        let json = {
            email
        }
        resendAccountVerificationApi(json, response => {
            if (!response?.error) {
                successToast(response?.message)
            } else {
                errorToast(response?.message)
            }
        })
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-center items-center mb-8">
                    <Image src={"images/logo.svg"} alt="logo" width={200} height={150} />
                </div>

                <div className="flex justify-center items-center flex-col">
                    <h2 className="text-2xl text-black font-bold mb-4">Verify your email address</h2>
                    <p className="text-[#757575] mb-4 text-[14px] text-center">
                        To complete your sign-up, please verify your email address. We've sent a verification link to
                        <br />
                        <span className="text-[#757575] font-bold">{email}</span>
                    </p>
                    <p className="text-[#757575] font-medium text-[14px] py-2 px-4 rounded">Didn't receive the email? <span onClick={resendVerificationEmail} className="text-blue-700 cursor-pointer">Resend link</span></p>
                </div>
            </div>
        </div>
    )
}

export default AccountCreated