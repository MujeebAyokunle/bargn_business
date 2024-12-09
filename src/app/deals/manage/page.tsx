"use client"
import Nav from '@/components/Nav.tsx'
import { getPages } from '@/helper/functions';
import React, { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IoIosSearch } from 'react-icons/io';
import { IoEllipsisVertical } from 'react-icons/io5';

function Managedeals() {

    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(1)

    const deals = [
        {
            id: "#2547",
            name: "Skiing and Snowboarding",
            date: "12-11-2024",
            status: "Redeemed",
            amount: "€170.00",
            location: "Helsinki",
        },
        {
            id: "#2547",
            name: "Northern Lights Hunting",
            date: "12-10-2024",
            status: "Completed",
            amount: "€140.90",
            location: "Rovaniemi",
        },
        {
            id: "#2547",
            name: "Snowmobiling",
            date: "14-09-2024",
            status: "Expired",
            amount: "€140.90",
            location: "Kuopio",
        },
        // Add other deals here
    ];

    const onPageChange = (page: number) => setPageNumber(page)

    return (
        <Nav>
            <div className='p-4'>
                <div className="mb-6 w-full">
                    <h1 className="text-2xl text-[#0A0909] font-bold">Manage deals</h1>

                    <div className='items-center grid grid-cols-7 gap-6 mt-6 mb-12' >
                        <div className='flex col-span-2 items-center p-2 rounded-lg bg-white'>
                            <IoIosSearch color='#979797' size={22} />
                            <input placeholder='Search deals' type="text" className='flex flex-1 text-black text-[16px] focus:outline-none ms-2' />
                        </div>

                        <select name="id" id="id" className='col-span-1 rounded-lg bg-white p-3 text-[#979797] text-[16px] focus:outline-none'>
                            <option value="Redemption ID">Redemtion ID</option>
                        </select>

                        <select name="deals" id="deals" className='col-span-1 rounded-lg bg-white p-3 text-[#979797] text-[16px] focus:outline-none'>
                            <option value="deals">Deals</option>
                        </select>

                        <select name="deals_statue" id="deals_status" className='col-span-1 rounded-lg bg-white p-3 text-[#979797] focus:outline-none text-[16px]'>
                            <option value="deals status">Deals status</option>
                        </select>
                    </div>

                    <div className="p-6 bg-white rounded-lg">
                        <div className="mb-4">
                            <p className="text-[20px] font-bold text-black">Manage deals</p>
                        </div>

                        <table className="min-w-full text-left mb-8 border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Redemption ID</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Deals</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Date</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Deal Status</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Amount</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Location</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deals.map((deal, index) => (
                                    <tr
                                        key={index}
                                        className="border-b hover:bg-gray-100 transition duration-200"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-800">{deal.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{deal.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{deal.date}</td>
                                        <td className="px-6 py-4 text-sm flex items-center space-x-1">
                                            <div style={{ width: 6, height: 6, borderRadius: 3 }} className={`${deal.status === "Redeemed"
                                                ? "bg-green-500"
                                                : deal.status === "Completed"
                                                    ? "bg-blue-500"
                                                    : "bg-red-500"
                                                }`} />
                                            <p className='text-black'>
                                                {deal.status}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{deal.amount}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{deal.location}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            <button className="text-gray-500 hover:text-gray-700">
                                                <IoEllipsisVertical color='black' className='cursor-pointer' />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="m-4 flex justify-between items-center mt-6">
                            <button onClick={() => {
                                if (pageNumber > 1)
                                    setPageNumber(prev => prev - 1)
                            }} className="px-4 flex items-center justify-center py-2 bg-[#F9FAFB] border border-[#E5E7EB] text-gray-700 rounded-lg hover:bg-gray-300">
                                <FiChevronLeft size={20} />
                                Previous
                            </button>
                            <div className="flex space-x-2">
                                {getPages(pageNumber, totalPages).map((page, index) => (
                                    <button
                                        key={index}
                                        onClick={() => typeof page === "number" && onPageChange(page)}
                                        className={`px-3 py-2 rounded-lg ${page === pageNumber
                                            ? "bg-[#EEF2FF] border border-[#6366f1] text-[#6366f1]"
                                            : "bg-[#F9FAFB] border border-[#E5E7EB] text-gray-700 hover:bg-gray-300"
                                            }`}
                                        disabled={page === "..."}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => {
                                if (pageNumber < totalPages)
                                    setPageNumber(prev => prev + 1)
                            }} className="px-4 py-2 flex justify-center items-center space-x-2 bg-[#F9FAFB] border border-[#E5E7EB] text-gray-700 rounded-lg hover:bg-gray-300">
                                Next
                                <FiChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Nav >
    )
}

export default Managedeals