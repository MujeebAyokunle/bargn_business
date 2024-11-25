import Nav from '@/components/Nav.tsx'
import Image from 'next/image'
import React from 'react'
// import DropImage from "@"

function CreateDeal() {
    return (
        <Nav>
            <div className='p-6'>
                <div className="mb-6 w-full">
                    <h1 className="text-2xl text-[#0A0909] font-bold">Add Deals</h1>

                    <div className="w-full p-8 px-20 rounded-lg">
                        <h1 className="text-xl font-bold mb-6">Create New Deal</h1>
                        <form className="space-y-6">
                            {/* Deal Title */}
                            <div>
                                <label
                                    htmlFor="dealTitle"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Deal Title
                                </label>
                                <input
                                    id="dealTitle"
                                    type="text"
                                    placeholder="Enter deal title"
                                    className="w-full border bg-transparent border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    defaultValue="Hideout Villas"
                                />
                            </div>

                            {/* Price and Deals Available */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="price"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Price (€)
                                    </label>
                                    <input
                                        id="price"
                                        type="text"
                                        placeholder="Enter price"
                                        className="w-full border bg-transparent border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue="2345.68"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="dealsAvailable"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Deals available
                                    </label>
                                    <input
                                        id="dealsAvailable"
                                        type="number"
                                        placeholder="Enter available deals"
                                        className="w-full bg-transparent border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue="40"
                                    />
                                </div>
                            </div>

                            {/* Deals Category */}
                            <div>
                                <label
                                    htmlFor="dealsCategory"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Deals Category
                                </label>
                                <select
                                    id="dealsCategory"
                                    className="w-full border bg-transparent border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option>Travel & Hotels</option>
                                    <option>Villa Collection</option>
                                    <option>Experience</option>
                                </select>
                            </div>

                            {/* Offer Expiration Date */}
                            <div>
                                <label
                                    htmlFor="offerExpiration"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Offer expiration date
                                </label>
                                <input
                                    id="offerExpiration"
                                    type="date"
                                    className="w-full bg-transparent border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Upload Image */}
                            <div>
                                <label
                                    htmlFor="uploadImage"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Upload Image
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center py-6">
                                    <Image src={"/images/image.jpg"} alt="drop_image" width={90} height={90} />
                                    <p className="text-sm text-gray-500">
                                        Drop your files here or{" "}
                                        <span className="text-[#6366F1] cursor-pointer">browse</span>
                                    </p>
                                    <p className="text-xs text-gray-400">Maximum size: 50MB</p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    className="text-gray-600 hover:text-gray-800 px-4 py-2"
                                >
                                    Save as draft
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#6366F1] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#6366F1]"
                                >
                                    Create Deal
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </Nav>
    )
}

export default CreateDeal