"use client"
import { getchRedeemedDeals, redeemCustomerDeal } from '@/apis';
import Nav from '@/components/Nav.tsx'
import { errorToast, getPages, successToast, toTitleCase } from '@/helper/functions';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IoIosSearch } from 'react-icons/io';
import { IoEllipsisVertical } from 'react-icons/io5';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import _ from "lodash";

function Managedeals() {

    const router = useRouter()

    const [pageNumber, setPageNumber] = useState(1);
    const [dealToRedeem, setDealToRedeem] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(1)
    const [status, setStatus] = useState<string>("")
    const [searchText, setSearchText] = useState<string>("")
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [redeemedDeals, setRedeemedDeals] = useState<any>([])

    useEffect(() => {

        const cookie = Cookies.get("token")
        if (!cookie) {
            router.push("/")
            return
        }
    }, [])

    useEffect(() => {
        initialize("")
    }, [pageNumber, status])

    const onPageChange = (page: number) => setPageNumber(page)

    const initialize = async (search_text: string) => {
        let json = {
            page_number: pageNumber,
            search_text,
            status
        }
        getchRedeemedDeals(json, response => {

            setRedeemedDeals(response?.redeemed_deals)
            setTotalPages(response?.totalSalesPages)
        })
    }

    const handleChange = useCallback(
        _.debounce((newValue) => {
            initialize(newValue)
        }, 500), []);

    const searchDeal = (event: any) => {
        const value = event.target.value
        setSearchText(value)
        handleChange(value);
    }

    const redeemDeal = (param: "redeemed" | "cancelled") => {

        let json = {
            response: param,
            mydeal_id: dealToRedeem
        }
        redeemCustomerDeal(json, response => {
            if (!response.error) {
                successToast(response?.message)
                setOpenModal(false)
                initialize(searchText)
            } else {
                errorToast(response?.message)
            }
        })
    }

    return (
        <Nav>
            <div className='p-4'>
                <div className="mb-6 w-full">
                    <h1 className="text-2xl text-[#0A0909] font-bold">Manage deals</h1>

                    <div className='items-center grid grid-cols-7 gap-6 mt-6 mb-12' >
                        <div className='flex col-span-3 items-center p-2 rounded-lg bg-white'>
                            <IoIosSearch color='#979797' size={22} />
                            <input onChange={searchDeal} placeholder='Search deals' type="text" className='flex flex-1 text-black text-[16px] focus:outline-none ms-2' />
                        </div>

                        <select onChange={(event) => setStatus(event.target.value)} name="deals_statue" id="deals_status" className='col-span-2 rounded-lg bg-white p-3 text-[#979797] focus:outline-none text-[16px]'>
                            <option value="">...</option>
                            <option value="pending">Pending</option>
                            <option value="redeemed">Redeemed</option>
                            <option value="cancelled">Cancelled</option>
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
                                {redeemedDeals?.map((deal: any, index: number) => (
                                    <tr
                                        key={index}
                                        className="border-b hover:bg-gray-100 transition duration-200"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-800">{deal.order_id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{deal?.deal?.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{moment(deal.createdAt).format("dd-mm-yyy")}</td>
                                        <td className="px-6 py-4 text-sm flex items-center space-x-1">
                                            <div style={{ width: 6, height: 6, borderRadius: 3 }} className={`${deal.status === "redeemed"
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                                }`} />
                                            <p className='text-black'>
                                                {toTitleCase(deal.status)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800">€{deal.revenue}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{deal.location}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800 relative">

                                            <button onClick={() => {
                                                setDealToRedeem(deal.id)
                                                setOpenModal(prev => !prev)
                                            }} className="text-gray-500 hover:text-gray-700">
                                                <IoEllipsisVertical color='black' className='cursor-pointer' />
                                            </button>

                                            {
                                                (dealToRedeem == deal.id && openModal) && (
                                                    <div className='bg-white px-4 rounded-md absolute shadow-sm border z-10 top-10 left-0 flex-col py-2 justify-center items-center flex' >
                                                        <div>
                                                            <p onClick={() => redeemDeal("redeemed")} className='text-[#333] cursor-pointer text-center text-md' > Redeem </p>
                                                        </div>
                                                        <div>
                                                            <p onClick={() => redeemDeal("cancelled")} className='text-[#333] cursor-pointer mt-2 text-center text-md' > Revoke </p>
                                                        </div>
                                                        <hr className='bg-[#333] w-full my-2' />
                                                        <div>
                                                            <p onClick={() => {
                                                                setOpenModal(false)
                                                            }} className='text-[#333] cursor-pointer text-center text-md' > Cancel </p>
                                                        </div>
                                                    </div>
                                                )
                                            }

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