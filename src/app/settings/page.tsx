"use client"
import Nav from '@/components/Nav.tsx'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaFacebookF } from 'react-icons/fa'

function Settings() {

    return (
        <div className='mx-4 my-12' >
            <div className="w-full bg-white shadow-lg rounded-lg p-12">
                <p className="text-[20px] font-bold mb-6 text-black">Settings</p>

                {/* Language Section */}
                <div className="mb-6 border border-[#979797] rounded-lg p-4">
                    <h3 className="text-[20px] text-black font-medium mb-2">Language</h3>
                    <label className="block text-[12px] text-[#5e6366] mb-1 ">Choose Language</label>
                    <select className="w-full border border-[#979797] focus:outline-none rounded-lg px-3 py-2">
                        <option>English</option>
                        {/* Add more options as needed */}
                    </select>
                </div>

                {/* Notifications Section */}
                <div className="mb-6 border border-[#979797] rounded-lg p-4">
                    <h3 className="text-[20px] text-black font-medium mb-2">Notifications</h3>
                    <div className='flex justify-between items-center' >
                        <p className="block text-[12px] text-[#5e6366] mb-1 ">Choose notifications method</p>

                        <button className="text-lg underline text-black font-bold">Edit</button>
                    </div>

                    {/* Text Messages */}
                    <div className="flex items-center justify-between mb-4">
                        <div className='w-full'>
                            <label className="font-medium text-[16px] text-[#2c2c2c] mb-1 ">Text Messages</label>
                            <input
                                type="text"
                                value="+358-402345678"
                                disabled
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-800 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="flex items-center justify-between">
                        <div className='w-full'>
                            <label className="font-medium text-[16px] text-[#2c2c2c] mb-1 ">Email Address</label>
                            <input
                                type="email"
                                value="moniroy@bargn.net"
                                disabled
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-800 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Socials Section */}
                <div className="border border-[#979797] rounded-lg p-4">
                    <h3 className="text-[20px] text-black font-medium mb-2">Socials</h3>
                    <p className="block text-[12px] text-[#5e6366] mb-1 ">Link your social profiles</p>

                    {/* Social Links */}
                    <div className="space-y-4 mt-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 border border-[#979797] rounded flex items-center justify-center">
                                    <FaFacebookF size={18} color='blue' />
                                </div>
                                <span className="text-gray-800">Facebook</span>
                            </div>
                            <button className="text-sm text-[#AF52DE] font-medium">Connect</button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 border border-[#979797] rounded flex items-center justify-center">
                                    <Image src={"/images/instagram.png"} alt='instagram' height={20} width={20} />
                                </div>
                                <span className="text-gray-800">Instagram</span>
                            </div>
                            <button className="text-sm text-[#AF52DE] font-medium">Connect</button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 border border-[#979797] rounded flex items-center justify-center">
                                    <Image src={"/images/x.png"} alt='instagram' height={20} width={20} />
                                </div>
                                <span className="text-gray-800">X fka (Twitter)</span>
                            </div>
                            <button className="text-sm text-[#AF52DE] font-medium">Connect</button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-6">
                    <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg mr-3">Cancel</button>
                    <button className="px-4 py-2 bg-[#6366F1] text-white rounded-lg">Save</button>
                </div>
            </div>
        </div>
    )
}

export default Settings