import Image from 'next/image'
import React from 'react'

function Resetpassword() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 py-24 rounded-lg shadow-md">
                <div className="flex justify-center items-center mb-8">
                    <Image src={"images/logo.svg"} alt="logo" width={200} height={150} />
                </div>

                <div className="flex flex-col justify-center items-center mb-8" >
                    <p className='text-center text-black font-bold text-[20px] text-bold'>Reset Password?</p>
                </div>

                <form >
                    <div className="mb-4">
                        <label className="block text-[#5E6366] text-[12px] font-medium mb-2">Password</label>
                        <input
                            type="password"
                            // value={email}
                            // onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:ring-2 focus:none"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[#5E6366] text-[12px] font-medium mb-2">Confirm password</label>
                        <input
                            type="password"
                            // onChange={(e) => setEmail(e.target.value)}
                            // value={email}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:ring-2 focus:none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white mt-3 py-2 rounded-md hover:bg-gray-800"
                    >
                        Reset Password
                    </button>
                </form>

            </div>
        </div>
    )
}

export default Resetpassword