"use client"
import { ColorSchema } from '@/helper/colorScheme'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { BsCamera } from 'react-icons/bs'
import { IoChevronForward, IoShareOutline } from 'react-icons/io5'
import PhoneInput from 'react-phone-input-2'
// import Autocomplete from "react-google-autocomplete";
import * as Yup from 'yup';
import 'react-phone-input-2/lib/style.css'
import { ErrorMessage, Form, Formik } from 'formik'
import ActivityLoader from '@/components/ActivityLoader'
import { errorToast, successToast } from '@/helper/functions'
import { axiosInstance, completeProfileApi, fetchCategoriesApi, getCoordinateApi } from '@/apis'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { setUserData } from '@/lib/features/businessSlice'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import { MdClose } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'

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
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<any>([]);
    const [images, setImages] = useState<any>([]);
    const [previewImages, setPreviewImages] = useState<any>([]);
    const [imagesUploadPercentage, setImagesUploadPercentage] = useState<any>([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
    const [abortControllers, setAbortControllers] = useState<AbortController[]>([]);
    const [activeTab, setActiveTab] = useState<number>(1);
    const [isDragging, setIsDragging] = useState(false);
    const [formValues, setFormValues] = useState<any>({});

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
        setFormValues(values)
        setActiveTab(prev => prev + 1)
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

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) {

            let temp = previewImages
            let fileTemp = images

            // Generate a preview URL for the selected image
            const previewURL = URL.createObjectURL(file);

            temp.push(previewURL)
            fileTemp.push(file)
            setImages([...fileTemp])
            setPreviewImages([...temp])
            let imageIndex = temp?.length - 1
            uploadFile(file, imageIndex)

        }
    };

    const completeProfileFunc = () => {
        if (!id) {
            errorToast("ID is required")
            return
        }

        setLoading(true)
        let parsedCategory = JSON.parse(formValues?.businessCategory)
        let formData = new FormData()

        formData.append("business_name", formValues.businessName)
        formData.append("phone_country_code", formValues.phoneNumberCode)
        formData.append("phone_number", formValues.phoneNumber)
        formData.append("website", formValues.website)
        formData.append("business_category", parsedCategory?.name)
        formData.append("business_category_id", parsedCategory?.id?.toString())
        formData.append("business_id", id.toString())
        formData.append("address", formValues.streetAddress)
        formData.append("city", formValues.city)
        formData.append("bio", formValues.bio)
        formData.append("images_arr", JSON.stringify(uploadedImageUrls))
        formData.append("state", formValues.state)
        formData.append("postal_code", formValues.postalCode)
        formData.append("country", formValues.country)
        formData.append("latitude", formValues.latitude)
        formData.append("longitude", formValues.longitude)

        if (inputRef.current?.files?.[0]) {
            formData.append("profile_image", inputRef.current.files[0])
        }

        completeProfileApi(formData, response => {
            setLoading(false)
            if (!response?.error) {
                successToast(response.message)
                dispatch(setUserData(response?.admin))
                setActiveTab(prev => prev + 1)

            } else {
                errorToast(response?.message)
            }
        })
    }

    // Upload step 2 images
    const uploadFile = async (file: any, index: number) => {
        try {
            setImageLoading(true)

            const abortController = new AbortController(); // Create an AbortController            

            setAbortControllers((prev: any) => {
                let temp = [...prev]
                temp[index] = abortController
                return temp
            })

            const formData = new FormData();
            formData.append('image', file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent: any) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                    // Update the percentage for the specific image immutably
                    setImagesUploadPercentage((prevPercentages: any) => {
                        const updatedPercentages = [...prevPercentages];
                        updatedPercentages[index] = progress;
                        return updatedPercentages;
                    });
                },
            };

            const response = await axiosInstance.post('/business/imageupload', formData, config);

            // console.log('File uploaded successfully:', response.data);
            setImageLoading(false)
            // Update the URL for the specific image immutably
            setUploadedImageUrls((prevUrls: any) => {
                const updatedUrls = [...prevUrls];
                updatedUrls[index] = response?.data?.image_url;

                return updatedUrls;
            });
        } catch (error) {
            console.error('Error uploading file:', error);

            // Handle failure (optional: reset percentage or notify the user)            
        }
    };

    const stopUpload = (index: number) => {

        if (abortControllers[index]) {
            abortControllers[index].abort(); // Abort the upload            

            setAbortControllers((prev: any) => {
                let temp = [...prev]
                temp.splice(index, 1)
                return temp
            })

            // update percentage array
            setImagesUploadPercentage((prev: any) => {
                const updatedPercentage = [...prev];
                updatedPercentage.splice(index, 1)
                return updatedPercentage;
            });

            // update images file array    
            setImages((prev: any) => {
                const updatedImages = [...prev];
                updatedImages.splice(index, 1)
                return updatedImages;
            });

            // update preview images
            setPreviewImages((prev: any) => {
                const updatedPreviews = [...prev];
                updatedPreviews.splice(index, 1)
                return updatedPreviews;
            })
        }
    }

    const removeImage = (index: number) => {
        // update percentage array        
        setImagesUploadPercentage((prev: any) => {
            const updatedPercentage = [...prev];
            updatedPercentage.splice(index, 1)
            return updatedPercentage;
        });

        // update images file array    
        setImages((prev: any) => {
            const updatedImages = [...prev];
            updatedImages.splice(index, 1)
            return updatedImages;
        });

        // update uploaded image urls
        setUploadedImageUrls((prevUrls: any) => {
            const updatedUrls = [...prevUrls];
            updatedUrls.splice(index, 1)
            return updatedUrls;
        });

        // update preview images
        setPreviewImages((prev: any) => {
            const updatedPreviews = [...prev];
            updatedPreviews.splice(index, 1)
            return updatedPreviews;
        })
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

            {
                activeTab != 3 ? (
                    <div className="w-[45%] flex justify-between items-center h-2 rounded-lg mt-8 my-6">
                        <div className='bg-black h-full rounded-full w-[49%]' />
                        <div className={`${activeTab == 1 ? "bg-[#D9D9D9]" : "bg-black"} h-full rounded-full w-[49%]`} />
                    </div>
                ) : ""
            }

            {/* First form tab */}
            {
                activeTab == 1 ? (
                    <div className="w-[90%] md:w-[60%] space-y-8 bg-white p-10 rounded-lg shadow-md">
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
                                bio: '',
                                phoneNumberCode: "",
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
                                                    onChange={(phone, data: any) => {
                                                        setFieldValue('phoneNumber', phone.substring(data.dialCode?.length))
                                                        setFieldValue('phoneNumberCode', data.dialCode)

                                                    }}
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

                                        <div className="grid grid-cols-1">
                                            <div>
                                                <label className="block text-sm font-medium text-[#5E6366] text-[15px]">Write a bio</label>
                                                <textarea name="bio" onChange={(value) => {
                                                    setFieldValue("bio", value.target.value)
                                                }} className="mt-1 w-full px-3 py-2 text-black border rounded-md min-h-[200px] shadow-sm border-[#5E6366] focus:outline-none focus:ring-none focus:ring-[#5E6366]" />
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
                ) : activeTab == 2 ? (
                    <div className="w-[90%] md:w-[60%] space-y-8 bg-white p-10 rounded-lg shadow-md">
                        <div className='flex mb-4 border-b border-b-black pb-10 items-center space-x-4' >
                            <div className='border border-[#D8D8D8] p-3 rounded-full' >
                                <IoShareOutline size={24} color="#2C2C2C" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Upload files</h2>
                                <p className="text-sm text-gray-600">
                                    Upload 3-5 images to tell customers more about your business
                                </p>
                            </div>
                        </div>


                        <div className={`border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center py-10 ${isDragging ? 'bg-gray-100' : ''}`} onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}>
                            <input
                                id="uploadImage"
                                name="uploadImage"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event: any) => {

                                    const file = event.currentTarget.files[0];
                                    if (file) {
                                        let temp = previewImages
                                        let fileTemp = images

                                        // Generate a preview URL for the selected image
                                        const previewURL = URL.createObjectURL(file);

                                        temp.push(previewURL)
                                        fileTemp.push(file)
                                        setImages([...fileTemp])
                                        setPreviewImages([...temp])
                                        let imageIndex = temp?.length - 1
                                        uploadFile(file, imageIndex)
                                    }
                                }}
                            />
                            <Image src={"/images/image.jpg"} alt="drop_image" width={90} height={90} />
                            <p className="text-sm text-gray-500">
                                <label
                                    htmlFor="uploadImage"
                                    className="text-[#2563EB] underline cursor-pointer"
                                >
                                    Click to Upload
                                </label>
                                {" "} or drag and drop
                            </p>
                            <p className="text-xs text-gray-400">Maximum size: 50MB</p>
                        </div>

                        {
                            images?.map((image: any, index: number) => (
                                <div key={index.toString()} className="border border-black rounded-md flex flex-col justify-center my-2 p-3">
                                    <div className="flex justify-between">
                                        <div className="flex items-start space-x-3 w-full">
                                            <img src={previewImages?.[index]} alt="image" className="h-[60px] w-[60px] rounded" />
                                            <div className="flex flex-col w-full">
                                                <div>
                                                    <p className="text-[#2c2c2c] text-[16px] font-bold">{image?.name}</p>
                                                    <p className="text-[#979797] font-medium text-[16px]">{image?.size ? (image?.size / (1024 * 1024)).toFixed(2) : 0}mb</p>
                                                </div>

                                                <div className="flex items-center mt-0 space-x-2">
                                                    <div className="bg-[#D9D9D9] h-[6px] rounded-full w-full">
                                                        {/* Use inline styles to dynamically set the width */}
                                                        <div
                                                            className="bg-[#39AEF2] h-full rounded-full"
                                                            style={{ width: `${imagesUploadPercentage?.[index] || 0}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-black font-bold text-[14px]">{imagesUploadPercentage?.[index]}%</p>
                                                </div>
                                            </div>
                                        </div>

                                        {imagesUploadPercentage[index] !== 100 ? (
                                            <MdClose color="black" className="cursor-pointer" onClick={() => stopUpload(index)} size={20} />
                                        ) : (
                                            <RiDeleteBin5Line onClick={() => removeImage(index)} color="black" className="cursor-pointer" size={20} />
                                        )}
                                    </div>
                                </div>
                            ))
                        }


                        {/* Bottom buttons */}
                        <div className="flex justify-end items-center mt-6 space-x-4">

                            <button onClick={() => setActiveTab(prev => prev - 1)} className="flex items-center w-[100px] justify-center h-[45px] px-4 py-2 bg-[#CDCDCD] text-black rounded-md focus:outline-none">
                                <p className="flex items-center px-4 py-2 text-black rounded-md focus:outline-none">
                                    Cancel
                                </p>
                            </button>

                            <button onClick={() => completeProfileFunc()} className="flex items-center w-[100px] justify-center h-[45px] px-4 py-2 bg-[#1E1E1E] text-white rounded-md focus:outline-none">
                                {
                                    loading ?
                                        <ActivityLoader />
                                        :
                                        <p className="flex items-center px-4 py-2 text-white rounded-md focus:outline-none">
                                            Save
                                        </p>
                                }
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-[90%] md:w-[60%] space-y-8 bg-white p-10 rounded-lg shadow-md">
                        <div className='flex items-center justify-center' >
                            <p className='text-[50px]'> 🎉 </p>
                        </div>

                        <div className='flex justify-center items-center flex-col' >
                            <h2 className="text-2xl font-bold text-gray-900">Upload Successful</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Your images have been uploaded successfully
                            </p>
                        </div>

                        <div className='flex justify-center align-center'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4' >
                                {
                                    uploadedImageUrls?.map((data: string, index: number) => (
                                        <img src={data} alt={data} key={index} style={{ width: 300, height: 166, objectFit: "cover" }} className='rounded' />
                                    ))
                                }
                            </div>
                        </div>

                        {/* Bottom buttons */}
                        <div className="flex justify-end items-center mt-6 space-x-4">

                            <button onClick={() => setActiveTab(prev => prev - 1)} className="flex items-center w-[100px] justify-center h-[45px] px-4 py-2 bg-[#CDCDCD] text-black rounded-md focus:outline-none">
                                <p className="flex items-center px-4 py-2 text-black rounded-md focus:outline-none">
                                    Back
                                </p>
                            </button>

                            <button onClick={() => router.push("/dashboard")} className="flex items-center w-[100px] justify-center h-[45px] px-4 py-2 bg-[#1E1E1E] text-white rounded-md focus:outline-none">
                                <p className="flex items-center px-4 py-2 text-white rounded-md focus:outline-none">
                                    Proceed
                                </p>
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default CompleteProfile