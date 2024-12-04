"use client"
import Nav from '@/components/Nav.tsx'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import { createDealApi, createDealDraftApi, fetchDealDraftApi, fetchSingleDraftApi } from '@/apis';
import { errorToast, successToast } from '@/helper/functions';
import ActivityLoader from '@/components/ActivityLoader';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';


const validationSchema = Yup.object({
    dealTitle: Yup.string().required("Deal title is required"),
    price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be greater than zero")
        .required("Price is required"),
    dealsAvailable: Yup.number()
        .typeError("Deals available must be a number")
        .integer("Deals available must be an integer")
        .positive("Deals available must be greater than zero")
        .required("Deals available is required"),
    dealsCategory: Yup.string().required("Please select a category"),
    offerExpiration: Yup.date()
        .min(new Date(), "Offer expiration date cannot be in the past")
        .required("Offer expiration date is required"),
    uploadImage: Yup.mixed().required("Please upload an image"),
});

function CreateDeal() {

    const router = useRouter()
    const draft_id = useSearchParams().get("draft")

    const [loading, setLoading] = useState(false)
    const [draftLoading, setDraftLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false);

    const formik: any = useFormik({
        initialValues: {
            dealTitle: "",
            price: "",
            dealsAvailable: "",
            dealsCategory: "",
            offerExpiration: "",
            uploadImage: null,
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            
            if (!values.uploadImage) return

            setLoading(true)

            const formData = new FormData()

            formData.append("title", values.dealTitle)
            formData.append("price", values.price)
            formData.append("category", values.dealsCategory)
            formData.append("available_number", values.dealsAvailable)
            formData.append("expiration", values.offerExpiration)
            formData.append("deal_image", values.uploadImage)

            createDealApi(formData, response => {

                setLoading(false)
                if (!response?.error) {

                    successToast(response?.message)
                    resetForm({
                        values: {
                            dealTitle: "",
                            price: "",
                            dealsAvailable: "",
                            dealsCategory: "",
                            offerExpiration: "",
                            uploadImage: null,
                        }
                    });
                    router.push("/deals")
                } else {
                    errorToast(response?.message)
                }
            })

        },
    });

    useEffect(() => {
        const cookie = Cookies.get("token")
        if (!cookie) {
            router.push("/")
            return
        }

        fetchSavedDraft()
    }, [draft_id])

    // Fetch saved draft
    const fetchSavedDraft = () => {
        if (!draft_id) return
        let param = {
            id: draft_id
        }
        fetchSingleDraftApi(param, response => {

            if (!response?.error) {
                formik.setValues({
                    offerExpiration: response?.draft?.expiration || new Date().toISOString().split('T')[0],
                    dealTitle: response.draft?.name || "",
                    price: response.draft?.price || "",
                    dealsAvailable: response.draft?.number_available || "",
                    dealsCategory: response.draft?.category || "",
                    uploadImage: null,
                });

            };
        })
    }

    const saveDraft = () => {
        setDraftLoading(true)

        let json = {
            name: formik.values.dealTitle,
            price: formik.values.price,
            category: formik.values.dealsCategory,
            number_available: formik.values.dealsAvailable,
            expiration: formik.values.offerExpiration
        }

        createDealDraftApi(json, response => {
            setDraftLoading(false)
            if (!response?.error) {
                successToast(response?.message)
            } else {
                errorToast(response?.message)
            }
        })
    }

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
            formik.setFieldValue("uploadImage", file);
        }
    };

    return (
        <Nav>
            <div className='p-4'>
                <div className="mb-6 w-full">
                    <h1 className="text-2xl text-[#0A0909] font-bold">Add Deals</h1>

                    <div className="w-full p-8 px-20 rounded-lg">
                        <h1 className="text-xl font-bold mb-6">Create New Deal</h1>

                        <form className="space-y-6" onSubmit={formik.handleSubmit}>
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
                                    name="dealTitle"
                                    type="text"
                                    placeholder="Enter deal title"
                                    className="w-full border bg-transparent border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formik.values.dealTitle}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.dealTitle && formik.errors.dealTitle && (
                                    <p className="text-red-500 text-sm mt-1">{formik.errors.dealTitle}</p>
                                )}
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
                                        name="price"
                                        type="text"
                                        placeholder="Enter price"
                                        className="w-full border bg-transparent border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.price && formik.errors.price && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="dealsAvailable"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Deals Available
                                    </label>
                                    <input
                                        id="dealsAvailable"
                                        name="dealsAvailable"
                                        type="number"
                                        placeholder="Enter available deals"
                                        className="w-full bg-transparent border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={formik.values.dealsAvailable}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.dealsAvailable && formik.errors.dealsAvailable && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.dealsAvailable}</p>
                                    )}
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
                                    name="dealsCategory"
                                    className="w-full border bg-transparent border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formik.values.dealsCategory}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Travel & Hotels">Travel & Hotels</option>
                                    <option value="Villa Collection">Villa Collection</option>
                                    <option value="Experience">Experience</option>
                                </select>
                                {formik.touched.dealsCategory && formik.errors.dealsCategory && (
                                    <p className="text-red-500 text-sm mt-1">{formik.errors.dealsCategory}</p>
                                )}
                            </div>

                            {/* Offer Expiration Date */}
                            <div>
                                <label
                                    htmlFor="offerExpiration"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Offer Expiration Date
                                </label>
                                <input
                                    id="offerExpiration"
                                    name="offerExpiration"
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-transparent border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formik.values.offerExpiration}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.offerExpiration && formik.errors.offerExpiration && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {formik.errors.offerExpiration}
                                    </p>
                                )}
                            </div>

                            {/* Upload Image */}
                            <div>
                                <label
                                    htmlFor="uploadImage"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Upload Image
                                </label>
                                <div className={`border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center py-6 ${isDragging ? 'bg-gray-100' : ''}`} onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}>
                                    <input
                                        id="uploadImage"
                                        name="uploadImage"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(event: any) =>
                                            formik.setFieldValue("uploadImage", event.currentTarget.files[0])
                                        }
                                    />
                                    <Image src={"/images/image.jpg"} alt="drop_image" width={90} height={90} />
                                    <p className="text-sm text-gray-500">
                                        Drop your files here or{" "}
                                        <label
                                            htmlFor="uploadImage"
                                            className="text-[#6366F1] cursor-pointer"
                                        >
                                            browse
                                        </label>
                                    </p>
                                    <p className="text-xs text-gray-400">Maximum size: 50MB</p>
                                </div>
                                {/* Show selected file name */}
                                {
                                    formik.values.uploadImage && (
                                        <p className='text-black mt-1 text-[14px]'>{formik.values.uploadImage?.name}</p>
                                    )
                                }
                                {formik.touched.uploadImage && formik.errors.uploadImage && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {formik.errors.uploadImage}
                                    </p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end items-center">
                                <button
                                    type="button"
                                    className="text-gray-600 hover:text-gray-800 px-4 py-2"
                                    onClick={saveDraft}
                                >
                                    {
                                        draftLoading ?
                                            <ActivityLoader color="#000" /> :
                                            "Save as draft"
                                    }
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#6366F1] text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:bg-[#6366F1]"
                                >
                                    {
                                        loading ?
                                            <ActivityLoader />
                                            : "Create Deal  "
                                    }
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