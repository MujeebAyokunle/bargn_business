"use client"
import Nav from '@/components/Nav.tsx'
import { useRouter } from 'next/navigation'
import React from 'react'

function Settings() {

    return (
        <div className='mx-4 my-12' >
            <div className="w-full bg-white shadow-lg rounded-lg p-12">
                <p className="text-[20px] font-bold mb-6 text-black">Settings</p>

                {/* Language Section */}
                <div className="mb-6 border border-[#979797] rounded-lg p-4">
                    <h3 className="text-[20px] text-black font-medium mb-2">Language</h3>
                    <label className="block text-[12px] text-[#5e6366] mb-1 ">Choose Language</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>English</option>
                        {/* Add more options as needed */}
                    </select>
                </div>

                {/* Notifications Section */}
                <div className="mb-6 border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">Notifications</h3>
                    <p className="text-sm text-gray-600 mb-4">Choose notifications method</p>

                    {/* Text Messages */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <label className="block text-sm text-gray-600">Text Messages</label>
                            <input
                                type="text"
                                value="+358-402345678"
                                disabled
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-800 cursor-not-allowed"
                            />
                        </div>
                        <button className="text-sm text-blue-600 font-medium">Edit</button>
                    </div>

                    {/* Email Address */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm text-gray-600">Email Address</label>
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
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">Socials</h3>
                    <p className="text-sm text-gray-600 mb-4">Link your social profiles</p>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">F</span>
                                </div>
                                <span className="text-gray-800">Facebook</span>
                            </div>
                            <button className="text-sm text-purple-600 font-medium">Connect</button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">I</span>
                                </div>
                                <span className="text-gray-800">Instagram</span>
                            </div>
                            <button className="text-sm text-purple-600 font-medium">Connect</button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">X</span>
                                </div>
                                <span className="text-gray-800">X fka (Twitter)</span>
                            </div>
                            <button className="text-sm text-purple-600 font-medium">Connect</button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-6">
                    <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg mr-3">Cancel</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
                </div>
            </div>
        </div>
    )
}

export default Settings