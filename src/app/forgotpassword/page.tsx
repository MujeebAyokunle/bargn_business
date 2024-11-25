"use client"
import { sendResetPasswordOtpApi } from '@/apis';
import { errorToast, successToast } from '@/helper/functions';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'

function Forgotpassword() {

    const router = useRouter()

    const submit = (event: any) => {
        event.preventDefault();

        let json = {
            registered_email: ""
        }

        sendResetPasswordOtpApi(json, response => {
            if (!response?.error) {
                successToast(response?.message)
                router.push("/resetpassword")
            } else {
                errorToast(response?.message)
            }
        })


    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 py-24 rounded-lg shadow-md">
                <div className="flex justify-center items-center mb-8">
                    <Image src={"images/logo.svg"} alt="logo" width={200} height={150} />
                </div>

                <div className="flex flex-col justify-center items-center mb-8" >
                    <p className='text-center text-black font-bold text-[20px] text-bold'>Forgot Password?</p>
                    <p className='text-center my-3 text-[#757575] text-medium text-[16px]' >Don't worry, we'll help you regain access to your account. Enter the email address associated with your account and we’ll send you a link to reset your password.</p>
                </div>

                <form onSubmit={submit}>
                    <div className="mb-4">
                        <label className="block text-[#5E6366] text-[12px] font-medium mb-2">Business Email</label>
                        <input
                            type="email"
                            // value={email}
                            // onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:ring-2 focus:none"
                            placeholder="sales@hideoutvillas.com"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white mt-3 py-2 rounded-md hover:bg-gray-800"
                    >
                        Send link
                    </button>
                </form>

            </div>
        </div>
    )
}

export default Forgotpassword