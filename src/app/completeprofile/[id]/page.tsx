"use client"
import { ColorSchema } from '@/helper/colorScheme'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { BsCamera } from 'react-icons/bs'
import { IoChevronForward } from 'react-icons/io5'
import PhoneInput from 'react-phone-input-2'
// import Autocomplete from "react-google-autocomplete";
import * as Yup from 'yup';
import 'react-phone-input-2/lib/style.css'
import { ErrorMessage, Form, Formik } from 'formik'
import ActivityLoader from '@/components/ActivityLoader'
import { errorToast, successToast } from '@/helper/functions'
import { completeProfileApi, fetchCategoriesApi, getCoordinateApi } from '@/apis'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { setUserData } from '@/lib/features/businessSlice'
import { useDispatch } from 'react-redux'

const validationSchema = Yup.object({
    businessName: Yup.string().required('Business name is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    businessId: Yup.string(),
    website: Yup.string()
        .required('Website is required')
        .matches(
            /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
            'Invalid URL'
        ).required('Website is required'),
    city: Yup.string().required('City is required'),
    businessCategory: Yup.string().required('Business category is required'),
    state: Yup.string().required('State is required'),
    postalCode: Yup.string().required('Postal Code is required'),
    country: Yup.string().required('Country is required'),
});

function CompleteProfile() {

    const router = useRouter()
    const inputRef = useRef<any>()
    const { id } = useParams()
    const dispatch = useDispatch()

    const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyD_hA8Lkcm7jjW6gM9_-VgZjD4O9DJr5dA";

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<any>([]);

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


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setSelectedImage(e.target.result as string); // Set image preview URL
                }
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const submitFunc = (values: any) => {

        if (!id) {
            errorToast("ID is required")
            return
        }

        setLoading(true)
        let parsedCategory = JSON.parse(values?.businessCategory)
        let formData = new FormData()

        formData.append("business_name", values.businessName)
        formData.append("phone_country_code", values.phoneNumber?.slice(0, 3))
        formData.append("phone_number", values.phoneNumber?.slice(3))
        formData.append("website", values.website)
        formData.append("business_category", parsedCategory?.name)
        formData.append("business_category_id", parsedCategory?.id?.toString())
        formData.append("business_id", id.toString())
        formData.append("address", values.streetAddress)
        formData.append("city", values.city)
        formData.append("state", values.state)
        formData.append("postal_code", values.postalCode)
        formData.append("country", values.country)
        formData.append("latitude", values.latitude)
        formData.append("longitude", values.longitude)

        if (inputRef.current?.files?.[0]) {
            formData.append("profile_image", inputRef.current.files[0])
        }

        completeProfileApi(formData, response => {
            setLoading(false)
            if (!response?.error) {
                successToast(response.message)
                
                dispatch(setUserData(response?.admin))
                router.push("/dashboard")
            } else {
                errorToast(response?.message)
            }
        })
    }

    const handlePlaceSelect = async (place: any, setFieldValue: any) => {

        // Extracting location details (coordinates, address, etc.)          
        if (place?.value?.place_id) {
            // const { description } = place.value;            
            // Fetch details using Google Places API (optional step if you want more details)
            getCoordinateApi(place?.value?.place_id, response => {
                if (!response?.error) {

                    setFieldValue("latitude", response?.coordinate?.location?.lat || 0);
                    setFieldValue("longitude", response?.coordinate?.location?.lng || 0);

                    setFieldValue('country', response?.coordinate?.country);
                    setFieldValue('streetAddress', place?.label)
                    setFieldValue('city', response?.coordinate?.city);
                    setFieldValue('state', response?.coordinate?.state);
                    setFieldValue('postalCode', response?.coordinate?.postalCode);
                } else {
                    setFieldValue("latitude", 0);
                    setFieldValue("longitude", 0);
                }
            })
        } else {
            setFieldValue("latitude", 0);
            setFieldValue("longitude", 0);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-lg space-y-8 bg-white p-10 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Tell us more about your business. This information will be used to create your profile and help customers find you.
                </p>

                <Formik
                    initialValues={{
                        businessName: '',
                        phoneNumber: '',
                        businessId: id,
                        website: '',
                        businessCategory: JSON.stringify(categories?.[0]) || "",
                        streetAddress: '',
                        city: '',
                        latitude: 0,
                        longitude: 0,
                        state: '',
                        postalCode: '',
                        country: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={submitFunc}>
                    {({ setFieldValue, values }) => (
                        <>
                            <div className="flex items-center mb-4">
                                <input onChange={handleImageChange} type="file" className='hidden' ref={inputRef} accept="image/*" />
                                <div className="w-24 h-24 rounded-full border flex items-center justify-center bg-gray-100 text-gray-400">
                                    {selectedImage ? (
                                        <img
                                            src={selectedImage}
                                            alt="Uploaded logo"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <BsCamera size={25} color={ColorSchema.black} />
                                    )}

                                </div>
                                <button onClick={() => inputRef?.current?.click()} className="ml-4 h-8 px-4 py-0 border rounded-md text-[#2c2c2c] text-[14px] bg-[#cdcdcd] border-[#2c2c2c] hover:bg-gray-200">Upload logo</button>
                            </div>

                            <Form className='space-y-4'>

                                <div>
                                    <label className="block text-sm font-medium text-[#5E6366] text-[15px]">Business Name</label>
                                    <input name="businessName" onChange={(value) => setFieldValue("businessName", value.target.value)} type="text" placeholder="Hideout Villas" className="mt-1 w-full px-3 py-2 text-black border rounded-md shadow-sm border-[#5E6366] focus:outline-none focus:ring-none focus:ring-[#5E6366]" />
                                    <ErrorMessage
                                        name="businessName"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5E6366] text-[15px]">Phone Number</label>
                                    <div className="flex mt-1">
                                        <PhoneInput
                                            country={'fi'}
                                            containerStyle={{ borderWidth: 1, borderColor: "#5E6366", borderRadius: 8, paddingTop: 2, paddingBottom: 2 }}
                                            inputStyle={{ color: ColorSchema.black, width: "100%", border: "none" }}
                                            dropdownStyle={{ color: "black" }}
                                            value={values.phoneNumber}
                                            onChange={phone => setFieldValue('phoneNumber', phone)}
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="phoneNumber"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5E6366] text-[15px]">Business ID Number</label>
                                    <input value={id} onChange={() => null} disabled name="businessId" type="text" placeholder="1234567-8" className="mt-1 w-full px-3 py-2 text-black border rounded-md shadow-sm border-[#5E6366] focus:outline-none focus:ring-none focus:ring-[#5E6366]" />

                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5E6366] text-[15px]">Website</label>
                                    <input type="text" name="website" onChange={(event) => setFieldValue("website", event.target.value)} placeholder="https://hideoutvillas.com/" className="mt-1 w-full px-3 py-2 text-black border rounded-md shadow-sm border-[#5E6366] focus:outline-none focus:ring-none focus:ring-[#5E6366]" />
                                    <ErrorMessage
                                        name="website"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5E6366] text-[15px]">Business Category</label>
                                    <select name="businessCategory" onChange={(event) => setFieldValue("businessCategory", event?.target?.value)} className="mt-1 w-full px-3 py-2 h-[40px] text-black border rounded-md bg-white shadow-sm border-[#5E6366] focus:outline-none focus:ring-none focus:ring-[#5E6366]">
                                        <option value={""} >...</option>
                                        {
                                            categories?.map((data: { name: string, id: number }, index: number) => (
                                                <option value={JSON.stringify(data)} key={index}>{data?.name}</option>
                                            ))
                                        }
                                    </select>
                                    <ErrorMessage
                                        name="businessCategory"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5E6366] text-[15px]">Street Address</label>
                                    {/* <Autocomplete
                                        apiKey={apiKey}
                                        className="mt-1 w-full px-3 py-2 text-black border rounded-md shadow-sm border-[#5E6366] focus:outline-none focus:ring-none focus:ring-[#5E6366]"
                                        // options={{
                                        //     types: ['address'],
                                        //     // types: ['address'],
                                        //     // componentRestrictions: { country: 'us' }, // Restrict to a specific country
                                        // }}
                                        onPlaceSelected={(place: any) => {

                                            if (place.geometry) {
                                                const latitude = place.geometry.location?.lat();
                                                const address = place.formatted_address;

                                                const longitude = place.geometry.location?.lng();

                                                let city = '';
                                                let state = '';
                                                let postalCode = '';
                                                let country = '';

                                                // Loop through the address components to extract city, state, and postal code
                                                place.address_components.forEach((component: any) => {
                                                    const types = component.types;

                                                    if (types.includes('locality')) {
                                                        city = component.long_name; // City name
                                                    }
                                                    if (types.includes('administrative_area_level_1')) {
                                                        state = component.long_name; // State name
                                                    }
                                                    if (types.includes('postal_code')) {
                                                        postalCode = component.long_name; // Postal code
                                                    }

                                                    if (types.includes('country')) {
                                                        country = component.long_name; // Country name
                                                    }
                                                });

                                                setFieldValue('longitude', longitude)
                                                setFieldValue('country', country);
                                                setFieldValue('latitude', latitude)
                                                setFieldValue('streetAddress', address)
                                                setFieldValue('city', city);
                                                setFieldValue('state', state);
                                                setFieldValue('postalCode', postalCode);

                                            } else {

                                                setFieldValue('longitude', 0)
                                                setFieldValue('latitude', 0)
                                                setFieldValue('streetAddress', "")
                                            }
                                        }}
                                    /> */}
                                    <GooglePlacesAutocomplete
                                        apiKey={apiKey}
                                        selectProps={{
                                            onChange: (place) => {
                                                handlePlaceSelect(place, setFieldValue)
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
                                    {/* {selectedPlace && (
                                        <div>
                                            <h4>Selected Place:</h4>
                                            <p className='text-black text-[14px]'>{selectedPlace?.label}</p>
                                        </div>
                                    )} */}
                                    <ErrorMessage
                                        name="streetAddress"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#5E6366] text-[15px]">City</label>
                                        <input value={values.city} onChange={(value) => setFieldValue("city", value.target.value)} name="city" type="text" placeholder="Helsinki" className="mt-1 w-full px-3 py-2 text-black border rounded-md shadow-sm border-[#5E6366] focus:outline-none focus:ring-none focus:ring-[#5E6366]" />

                                        <ErrorMessage
                                            name="city"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#5E6366] text-[15px]">State/Province</label>
                                        <input value={values.state} name="state" type="text" onChange={(value) => setFieldValue("state", value.target.value)} placeholder="Helsinki" className="mt-1 w-full px-3 py-2 text-black border rounded-md shadow-sm border-[#5E6366] focus:outline-none focus:ring-none focus:ring-[#5E6366]" />

                                        <ErrorMessage
                                            name="state"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#5E6366] text-[15px]">Postal Code</label>
                                        <input name="postalCode" type="text" placeholder="00170" value={values.postalCode} onChange={(value) => setFieldValue("postalCode", value.target.value)} className="mt-1 w-full px-3 py-2 text-black border rounded-md shadow-sm border-[#5E6366] focus:outline-none focus:ring-none focus:ring-[#5E6366]" />
                                        <ErrorMessage
                                            name="postalCode"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#5E6366] text-[15px]">Country</label>
                                        <input name="country" type="text" placeholder="Finland" value={values.country} onChange={(value) => setFieldValue("country", value.target.value)} className="mt-1 w-full px-3 py-2 text-black border rounded-md shadow-sm border-[#5E6366] focus:outline-none focus:ring-none focus:ring-[#5E6366]" />
                                        <ErrorMessage
                                            name="country"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end items-center mt-6">

                                    <button type="submit" className="flex items-center w-[100px] justify-center h-[45px] px-4 py-2 bg-[#1E1E1E] text-white rounded-md focus:outline-none">
                                        {
                                            loading ?
                                                <ActivityLoader /> :
                                                (
                                                    <p className="flex items-center px-4 py-2 text-white rounded-md focus:outline-none">
                                                        Next <IoChevronForward className='ms-2' />
                                                    </p>
                                                )

                                        }
                                    </button>
                                </div>

                                <p className="text-center text-sm text-gray-500 mt-6">
                                    Need help? <a href="#" className="text-indigo-600 hover:underline">Contact Support</a>
                                </p>

                            </Form>
                        </>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default CompleteProfile