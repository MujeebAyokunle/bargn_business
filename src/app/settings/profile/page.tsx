"use client"
import 'react-phone-input-2/lib/style.css'
import { useAppSelector } from '@/lib/hooks';
import React, { useRef, useState } from 'react'
import { MdOutlineModeEdit } from 'react-icons/md';
import PhoneInput from 'react-phone-input-2';

function Profile() {

    const { userData } = useAppSelector(data => data.business)
    const profileImageRef = useRef<any>()

    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({
        businessName: "Hideout Villas",
        about: "",
        email: "sales@hideoutvillas.com",
        phoneNumber: "+358402345678",
        streetAddress: "Meritullinkatu 33, 00170 Helsinki",
        websiteUrl: "https://hideoutvillas.com/",
        country: "Finland",
        businessId: "1234567-8",
        category: "Hotel & Travels",
        city: "Helsinki",
        stateProvince: "Helsinki",
        postalCode: "00170",
        openingHour: "9:00 am",
        closingHour: "11:00 pm",
    });

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="mx-4 my-12 relative bg-white shadow-md rounded-lg">
            <div
                style={{ backgroundImage: `url("/images/cover.jpeg")`, backgroundSize: "cover", backgroundPosition: "center" }}
                className="h-[150px] w-full flex rounded-t-lg p-4"
            >
                <div className='flex relative justify-between w-full' >
                    <h1 className="text-2xl font-bold text-white">Edit Profile</h1>

                    {
                        editing &&
                        <div style={{ width: 36, height: 36, borderRadius: 18 }} className='bg-white cursor-pointer flex justify-center items-center' >
                            <MdOutlineModeEdit color='black' size={20} />
                        </div>
                    }
                    <div style={{ width: 120, height: 120, borderRadius: 60 }} className='absolute -bottom-16 left-6 p-0' >
                        <img src={userData?.profile_picture} className='w-full h-full rounded-full object-cover' alt="profile_image" />
                        {
                            editing &&
                            <div onClick={() => profileImageRef.current.click()} style={{ width: 30, height: 30, borderRadius: 15 }} className='bg-white cursor-pointer flex justify-center items-center absolute right-0 shadow-md bottom-0' >
                                <MdOutlineModeEdit color='black' size={18} />
                            </div>
                        }
                    </div>

                    <input type="file" accept='image/*' id="profileImage" className="hidden" ref={profileImageRef} />
                </div>
            </div>

            {/* display details or edit section */}
            {
                editing ?
                    (
                        <>

                            <form className='mt-20 px-8 py-4' onSubmit={handleSubmit}>

                                <p className='text-[#979797] text-lg font-bold mb-6' >Edit Profile</p>

                                {/* Business Details */}
                                <div className="mb-4">
                                    <label className="block text-[#5E6366] text-[16px] font-normal">Business Name</label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 text-[#5e6366] rounded-md px-3 py-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-[#5E6366] text-[16px] font-normal">About</label>
                                    <textarea
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 text-[#5e6366] rounded-md px-3 py-2"
                                    />
                                </div>

                                <hr className='my-6 border' />

                                {/* Contact Information */}
                                <div className="mb-4">
                                    <h2 className='text-[#979797] text-lg font-bold mb-2'>Contact Information</h2>
                                    <div className="mb-4">
                                        <label className="block text-[#5E6366] text-[16px] font-normal">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 text-[#5e6366] rounded-md px-3 py-2"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-600 text-sm font-medium mb-1">Phone Number</label>
                                        <div className="flex items-center w-full border border-gray-300 rounded px-2 py-1">
                                            <PhoneInput
                                                country="fi"
                                                containerStyle={{
                                                    border: "none", // Removes the default container border to blend with the Tailwind border
                                                    padding: 0,
                                                    margin: 0,
                                                }}
                                                inputStyle={{
                                                    fontSize: "14px", // Matches Tailwind's text-sm
                                                    fontWeight: "normal",
                                                    color: "#111827", // Tailwind's text-gray-900 equivalent
                                                    width: "100%",
                                                    border: "none", // Removes inner borders
                                                    outline: "none", // Ensures no outline on focus
                                                    boxShadow: "none", // Matches native focus appearance
                                                }}
                                                dropdownStyle={{
                                                    color: "#111827", // Tailwind's text-gray-900 equivalent
                                                    borderRadius: "0.5rem", // Matches Tailwind's `rounded-lg`
                                                }}
                                                value={formData.phoneNumber}
                                                onChange={(phone) => {
                                                    setFormData({
                                                        ...formData,
                                                        phoneNumber: phone
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[#5E6366] text-[16px] font-normal">Street Address</label>
                                        <input
                                            type="text"
                                            name="streetAddress"
                                            value={formData.streetAddress}
                                            onChange={handleChange}
                                            className="w-full border text-[#5e6366] border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-[#5E6366] text-[16px] font-normal">Website URL</label>
                                        <input
                                            type="url"
                                            name="websiteUrl"
                                            value={formData.websiteUrl}
                                            onChange={handleChange}
                                            className="w-full border text-[#5e6366] border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                </div>

                                {/* Business Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full text-[#5e6366] border border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Business ID Number</label>
                                        <input
                                            type="text"
                                            name="businessId"
                                            value={formData.businessId}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 text-[#5e6366] rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Business Category</label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full border text-[#5e6366] border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-gray-700">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 text-[#5e6366] rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">State/Province</label>
                                        <input
                                            type="text"
                                            name="stateProvince"
                                            value={formData.stateProvince}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 text-[#5e6366] rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            className="w-full border text-[#5e6366] border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <hr className='mt-10 mb-4 border' />

                                {/* Operating Hours */}
                                <h2 className='text-[#979797] text-lg font-bold mb-2'>Operating hours</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-gray-700">Opening Hour</label>
                                        <input
                                            type="text"
                                            name="openingHour"
                                            value={formData.openingHour}
                                            onChange={handleChange}
                                            className="w-full border text-[#5e6366] border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Closing Hour</label>
                                        <input
                                            type="text"
                                            name="closingHour"
                                            value={formData.closingHour}
                                            onChange={handleChange}
                                            className="w-full border text-[#5e6366] border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        onClick={() => setEditing(false)}
                                        type="button"
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={() => setEditing(false)}
                                        className="bg-[#6366F1] text-white px-4 py-2 rounded-md"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className='flex justify-end p-6' >
                                <div onClick={() => setEditing(prev => !prev)} className='flex items-center space-x-1 cursor-pointer justify-center border border-[#979797] rounded-lg px-3 py-2' >
                                    <MdOutlineModeEdit color='#979797' size={18} />
                                    <p className='text-[#979797] text-[16px] font-medium' >Edit</p>
                                </div>
                            </div>

                            {/* Details section */}
                            <div className="p-8">
                                {/* Business Profile Section */}
                                <div className="border border-[#5E6366] rounded-lg p-6 mb-6">
                                    <h2 className="text-lg text-black font-semibold mb-4">Business Profile</h2>
                                    <div className="mb-4">
                                        <p className="text-[#979797] text-[16px] font-medium">Business Name</p>
                                        <p className="text-black font-normal text-base">{userData?.business_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#979797] text-[16px] font-medium">About us</p>
                                        <p className="text-black text-base font-normal leading-relaxed">
                                            <span className="font-semibold">Hideout Villa</span> is your ultimate gateway to affordable luxury, specializing in exclusive discounts on hotels, vacations, lifestyle, and entertainment services. Whether you're planning a relaxing getaway, an adventurous trip, or indulging in premium lifestyle experiences, Hideout Villa connects you with unbeatable deals to make every moment memorable without breaking the bank.
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Information Section */}
                                <div className="border border-[#5E6366] rounded-lg p-6">
                                    <h2 className="text-lg text-black font-semibold mb-4">Contact Information</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Left Column */}
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Email</p>
                                            <p className="text-black text-base font-medium">{userData?.business_email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Phone Number</p>
                                            <p className="text-black text-base font-medium">+{userData?.phone_country_code}-{userData?.phone_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Street Address</p>
                                            <p className="text-black text-base font-medium">Meritullinkatu 33, 00170 Helsinki</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Website URL</p>
                                            <p className="text-black text-base font-medium">
                                                <a href="https://hideoutvillas.com/" target="_blank" rel="noopener noreferrer" className="text-black">
                                                    {userData?.website}
                                                </a>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Country</p>
                                            <p className="text-black text-base font-medium">Finland</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Business Category</p>
                                            <p className="text-black text-base font-medium">{userData?.business_category}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Business ID number</p>
                                            <p className="text-black text-base font-medium">{userData?.business_id}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">State Province</p>
                                            <p className="text-black text-base font-medium">Helsinki</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">City</p>
                                            <p className="text-black text-base font-medium">Helsinki</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Postal Code</p>
                                            <p className="text-black text-base font-medium">00170</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )

            }

        </div>
    )
}

export default Profile