"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

function page() {

    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-center items-center mb-8">
                    <p className='text-[60px]' >🎉 </p>
                </div>

                <div className="flex justify-center items-center flex-col">
                    <h2 className="text-2xl text-black font-bold mb-4">Password Updated
                        Successfully</h2>
                    <p className="text-[#757575] mb-4 text-[14px] text-center">
                        Your password has been updated successfully.
                    </p>

                    <button onClick={() => router.push("/") } className='bg-[#2c2c2c] py-2 w-full rounded text-base font-normal my-4' >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    )
}

export default page