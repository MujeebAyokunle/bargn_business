"use client"
import 'react-phone-input-2/lib/style.css'
import { useAppSelector } from '@/lib/hooks';
import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineModeEdit } from 'react-icons/md';
import PhoneInput from 'react-phone-input-2';
import { useFormik } from 'formik';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { editBusinessDetailsApi, fetchCategoriesApi, getCoordinateApi } from '@/apis';
import * as Yup from 'yup';
import { errorToast, successToast } from '@/helper/functions';
import { useDispatch } from 'react-redux';
import { fetchBusinessDetailsThunk, setUserData } from '@/lib/features/businessSlice';
import ActivityLoader from '@/components/ActivityLoader';

const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyD_hA8Lkcm7jjW6gM9_-VgZjD4O9DJr5dA";

function Profile() {

    const { userData, businessDetails } = useAppSelector(data => data.business)
    const profileImageRef = useRef<any>()
    const dispatch: any = useDispatch()

    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<any>([]);
    const [imageFile, setImageFile] = useState<any>(null);
    const [imageFileUrl, setImageFileUrl] = useState<any>(null);

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

    useEffect(() => {
        initialize()
    }, [])

    const initialize = async () => {
        fetchCategoriesApi(response => {

            if (!response?.error) {
                let tempCat = response?.categories.map((data: any) => { return { name: data?.name, id: data?.id } })

                setCategories(tempCat)
            }
        })
    }

    const formik = useFormik({
        initialValues: {
            businessName: businessDetails.business_name || '',
            about: businessDetails.about || '',
            email: businessDetails.business_email || '',
            phoneNumber: `${businessDetails?.phone_country_code}${businessDetails.phone_number}` || '',
            streetAddress: businessDetails.street_address || '',
            website: businessDetails.website || '',
            country: businessDetails.country || '',
            businessId: businessDetails.business_id || '',
            phone_country_code: businessDetails.phone_country_code || '',
            latitude: businessDetails.latitude || 0,
            longitude: businessDetails.longitude || 0,
            category: JSON.stringify({ name: businessDetails.business_category, id: businessDetails.business_category_id }) || '',
            city: businessDetails.city || '',
            state: businessDetails.state || '',
            postalCode: businessDetails.postal_code || '',
            openingHour: businessDetails.opening_hour || '',
            closingHour: businessDetails.closing_hour || '',
        },
        onSubmit: (values) => {

            setLoading(true)

            const formData = new FormData()

            let business_category, business_category_id

            if (values.category) {
                let { name, id } = JSON.parse(values.category)
                business_category = name
                business_category_id = id

            }

            formData.append("business_name", values.businessName)
            formData.append("about", values.about)
            formData.append("phone_country_code", values.phone_country_code)
            formData.append("phone_number", values.phoneNumber)
            formData.append("street_address", values.streetAddress)
            formData.append("website", values.website)
            formData.append("country", values.country)
            formData.append("business_category", business_category)
            formData.append("business_category_id", business_category_id)
            formData.append("city", values.city)
            formData.append("state", values.state)
            formData.append("postal_code", values.postalCode)
            formData.append("opening_hour", values.openingHour)
            formData.append("closing_hour", values.closingHour)
            formData.append("prev_image_url", businessDetails.profile_picture)
            formData.append("image", imageFile)

            editBusinessDetailsApi(formData, response => {
                setLoading(false)

                if (!response?.error) {
                    successToast(response?.message)
                    dispatch(fetchBusinessDetailsThunk())
                    let newUserData = {
                        ...userData,
                        business_category: values.category,
                        business_name: values.businessName,
                        phone_country_code: values.phone_country_code,
                        phone_number: values.phoneNumber,
                        profile_picture: response?.image_url,
                        website: values.website
                    }
                    dispatch(setUserData(newUserData))
                    setEditing(false);
                } else {
                    errorToast(response?.message)
                }
            })
        },
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setImageFile(file)
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setImageFileUrl(e.target.result as string); // Set image preview URL
                }
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const handlePlaceSelect = async (place: any) => {

        // Extracting location details (coordinates, address, etc.)          
        if (place?.value?.place_id) {

            // Fetch details using Google Places API (optional step if you want more details)
            getCoordinateApi(place?.value?.place_id, response => {
                if (!response?.error) {

                    formik.setFieldValue("latitude", response?.coordinate?.location?.lat || 0);
                    formik.setFieldValue("longitude", response?.coordinate?.location?.lng || 0);

                    formik.setFieldValue('country', response?.coordinate?.country);
                    formik.setFieldValue('streetAddress', place?.label)
                    formik.setFieldValue('city', response?.coordinate?.city);
                    formik.setFieldValue('state', response?.coordinate?.state);
                    formik.setFieldValue('postalCode', response?.coordinate?.postalCode);
                } else {
                    formik.setFieldValue("latitude", 0);
                    formik.setFieldValue("longitude", 0);
                }
            })
        } else {
            formik.setFieldValue("latitude", 0);
            formik.setFieldValue("longitude", 0);
        }
    };

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
                        <img src={editing ? imageFileUrl || businessDetails?.profile_picture : businessDetails?.profile_picture} className='w-full h-full rounded-full object-cover' alt="profile_image" />
                        {
                            editing &&
                            <div onClick={() => profileImageRef.current.click()} style={{ width: 30, height: 30, borderRadius: 15 }} className='bg-white cursor-pointer flex justify-center items-center absolute right-0 shadow-md bottom-0' >
                                <MdOutlineModeEdit color='black' size={18} />
                            </div>
                        }
                    </div>

                    <input type="file" onChange={handleImageChange} accept='image/*' id="profileImage" className="hidden" ref={profileImageRef} />
                </div>
            </div>

            {/* display details or edit section */}
            {
                editing ?
                    (
                        <>
                            <form className="mt-20 px-8 py-4" onSubmit={formik.handleSubmit}>
                                <p className="text-[#979797] text-lg font-bold mb-6">Edit Profile</p>

                                {/* Business Details */}
                                <div className="mb-4">
                                    <label className="block text-[#5E6366] text-[16px] font-normal">Business Name</label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formik.values.businessName}
                                        onChange={formik.handleChange}
                                        className="w-full border border-gray-300 text-[#5e6366] rounded-md px-3 py-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-[#5E6366] text-[16px] font-normal">About</label>
                                    <textarea
                                        name="about"
                                        value={formik.values.about}
                                        onChange={formik.handleChange}
                                        className="w-full min-h-24 border border-gray-300 text-[#5e6366] rounded-md px-3 py-2"
                                    />
                                </div>

                                <hr className="my-6 border" />

                                {/* Contact Information */}
                                <h2 className="text-[#979797] text-lg font-bold mb-2">Contact Information</h2>
                                <div className="mb-4">
                                    <label className="block text-[#5E6366] text-[16px] font-normal">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        disabled
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        className="w-full border border-gray-300 text-[#5e6366] rounded-md px-3 py-2"
                                    />
                                </div>

                                {/* Phone number */}
                                <div className="mb-4">
                                    <label className="block text-gray-600 text-sm font-medium mb-1">Phone Number</label>
                                    <div className="flex items-center w-full border border-gray-300 rounded px-2 py-1">
                                        <PhoneInput
                                            country="fi"
                                            containerStyle={{
                                                border: 'none',
                                                padding: 0,
                                                margin: 0,
                                            }}
                                            inputStyle={{
                                                fontSize: '14px',
                                                fontWeight: 'normal',
                                                color: '#111827',
                                                width: '100%',
                                                border: 'none',
                                                outline: 'none',
                                                boxShadow: 'none',
                                            }}
                                            dropdownStyle={{
                                                color: '#111827',
                                                borderRadius: '0.5rem',
                                            }}
                                            value={formik.values.phoneNumber}
                                            onChange={(phone, data: any) => {
                                                formik.setFieldValue('phoneNumber', phone.substring(data.dialCode?.length));
                                                formik.setFieldValue('phone_country_code', data.dialCode);
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* street address */}
                                <div className="mb-4">
                                    <label className="block text-[#5E6366] text-[16px] font-normal">Street Address</label>

                                    <GooglePlacesAutocomplete
                                        apiKey={apiKey}
                                        selectProps={{
                                            value: {
                                                label: formik.values.streetAddress,
                                                value: {
                                                    description: formik.values.streetAddress,
                                                    place_id: "",
                                                },
                                            },
                                            onChange: (place) => {
                                                handlePlaceSelect(place)
                                            },
                                            placeholder: 'Search for a location...',
                                            styles: {
                                                option: (provided) => ({
                                                    ...provided,
                                                    color: 'black',
                                                    fontSize: 14
                                                }),
                                            },
                                        }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-[#5E6366] text-[16px] font-normal">Website URL</label>
                                    <input
                                        type="text"
                                        name="website"
                                        value={formik.values.website}
                                        onChange={formik.handleChange}
                                        className="w-full border text-[#5e6366] border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700">Business ID Number</label>
                                        <input
                                            type="text"
                                            name="businessId"
                                            disabled
                                            value={formik.values.businessId}
                                            onChange={formik.handleChange}
                                            className="w-full border border-gray-300 text-[#5e6366] rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Business Category</label>

                                        <select name="category" onChange={(event) => formik.setFieldValue("category", event?.target?.value)} value={formik.values.category} className="mt-1 w-full px-3 py-2 h-[40px] text-black border rounded-md bg-white shadow-sm border-gray-300 focus:outline-none focus:ring-none focus:ring-[#5E6366]">
                                            <option value={""} >...</option>
                                            {
                                                categories?.map((data: { name: string, id: number }, index: number) => (
                                                    <option value={JSON.stringify(data)} key={index}>{data?.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-gray-700">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formik.values.city}
                                            onChange={formik.handleChange}
                                            className="w-full border border-gray-300 text-[#5e6366] rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">State/Province</label>
                                        <input
                                            type="text"
                                            name="stateProvince"
                                            value={formik.values.state}
                                            onChange={formik.handleChange}
                                            className="w-full border border-gray-300 text-[#5e6366] rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formik.values.postalCode}
                                            onChange={formik.handleChange}
                                            className="w-full border text-[#5e6366] border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formik.values.country}
                                            onChange={formik.handleChange}
                                            className="w-full text-[#5e6366] border border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <hr className="mt-10 mb-4 border" />

                                {/* Operating Hours */}
                                <h2 className="text-[#979797] text-lg font-bold mb-2">Operating hours</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-gray-700">Opening Hour</label>
                                        <input
                                            type="time"
                                            name="openingHour"
                                            value={formik.values.openingHour}
                                            onChange={formik.handleChange}
                                            className="w-full border text-[#5e6366] border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Closing Hour</label>
                                        <input
                                            type="time"
                                            name="closingHour"
                                            value={formik.values.closingHour}
                                            onChange={formik.handleChange}
                                            className="w-full border text-[#5e6366] border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end mt-8">
                                    <button
                                        type="button"
                                        className="bg-gray-300 text-[#5e6366] px-6 py-2 rounded-md mr-4 flex justify-center items-center"
                                        onClick={() => setEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-md"
                                    >
                                        {
                                            loading ? (
                                                <ActivityLoader />
                                            ) : "Save Changes"
                                        }
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
                                        <p className="text-black font-normal text-base">{businessDetails?.business_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#979797] text-[16px] font-medium">About us</p>
                                        <p className="text-black text-base font-normal leading-relaxed">
                                            {businessDetails?.about}
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
                                            <p className="text-black text-base font-medium">{businessDetails?.business_email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Phone Number</p>
                                            <p className="text-black text-base font-medium">+{businessDetails?.phone_country_code}-{businessDetails?.phone_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Street Address</p>
                                            <p className="text-black text-base font-medium">{businessDetails?.street_address}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Website URL</p>
                                            <p className="text-black text-base font-medium">
                                                <a href="https://hideoutvillas.com/" target="_blank" rel="noopener noreferrer" className="text-black">
                                                    {businessDetails?.website}
                                                </a>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Country</p>
                                            <p className="text-black text-base font-medium">{businessDetails?.country}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Business Category</p>
                                            <p className="text-black text-base font-medium">{businessDetails?.business_category}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Business ID number</p>
                                            <p className="text-black text-base font-medium">{businessDetails?.business_id}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">State Province</p>
                                            <p className="text-black text-base font-medium">{businessDetails?.state}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">City</p>
                                            <p className="text-black text-base font-medium">{businessDetails?.city}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#979797] text-[16px] font-medium">Postal Code</p>
                                            <p className="text-black text-base font-medium">{businessDetails?.postal_code}</p>
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