"use client"
import Nav from '@/components/Nav.tsx';
import { dealsData } from '@/helper/data'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';

function Deals() {

    const router = useRouter()

    const [activeTab, setActiveTab] = useState("all deals")

    const statusClasses: any = {
        Active: "bg-green-100 text-green-700",
        Archived: "bg-red-100 text-red-700",
        Processing: "bg-blue-100 text-blue-700",
        Drafts: "bg-gray-100 text-gray-700",
    };


    return (
        <Nav>
            <div className="p-6 bg-gray-100 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl text-[#0A0909] font-bold">Deals</h1>
                    <button onClick={() => router.push("/deals/create")} className="bg-[#6366F1] text-white px-4 py-2 rounded-lg flex items-center space-x-1 text-sm shadow-md hover:bg-[#6366F1]">
                        <FiPlus size={18} color='white' />
                        Add New Deal
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b mb-6">
                    {["All Deals", "Active", "Draft", "Archive"].map((tab, index) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 border ${index == 0 && "rounded-tl-md rounded-bl-md"} ${index == 3 && "rounded-tr-md rounded-br-md"} ${activeTab.toLowerCase() === tab.toLowerCase() ? "bg-[#F3F4F6]" : "bg-white"}`}
                            style={{ borderColor: "rgba(0,0,0,0.2)" }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <p className='text-[#6B7280] p-4 border-b'>All deals</p>
                    <table className="w-full table-auto text-left border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 ps-6 text-sm font-medium text-gray-700">Deals</th>
                                <th className="p-2 text-sm font-medium text-gray-700">Price</th>
                                <th className="p-2 text-sm font-medium text-gray-700">
                                    Category
                                </th>
                                <th className="p-2 text-sm font-medium text-gray-700">
                                    Deals Available
                                </th>
                                <th className="p-2 text-sm font-medium text-gray-700">
                                    Offer Expiration
                                </th>
                                <th className="p-2 text-sm font-medium text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dealsData.map((deal, index) => (
                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-50 transition duration-150"
                                >
                                    <td className="p-4 flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-200 rounded-lg"></div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {deal.deal}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700">{deal.price}</td>
                                    <td className="p-4 text-sm text-gray-700">{deal.category}</td>
                                    <td className="p-4 text-sm text-gray-700">{deal.available}</td>
                                    <td className="p-4 text-sm text-gray-700">{deal.expiration}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 text-sm rounded-full ${statusClasses[deal.status]}`}
                                        >
                                            {deal.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="m-4 flex justify-between items-center mt-6">
                        <button className="px-4 flex items-center justify-center py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                            <FiChevronLeft size={20} />
                            Previous
                        </button>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5, "...", 40].map((page, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-2 rounded-lg ${page === 5
                                        ? "bg-[#EEF2FF] border border-[#6366f1] text-[#6366f1]"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button className="px-4 py-2 flex justify-center items-center space-x-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                            Next
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>

            </div>
        </Nav >
    )
}

export default Deals