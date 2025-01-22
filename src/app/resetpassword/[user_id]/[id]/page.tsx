"use client"
import Image from 'next/image'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { resetPasswordApi } from '@/apis';
import { errorToast, successToast } from '@/helper/functions';
import ActivityLoader from '@/components/ActivityLoader';

function ResetPassword() {

    const { id, user_id } = useParams()
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    // return (
    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), ""], 'Passwords must match')
                .required('Confirm Password is required')
        }),
        onSubmit: values => {
            setLoading(true)
            let json = {
                newPassword: values.password,
                token: id,
                userId: user_id
            }
            console.log({ json })
            resetPasswordApi(json, response => {
                setLoading(false)
                console.log({ response })
                if (!response.error) {
                    successToast(response.message)
                    router.push("/resetsuccessful")
                } else {
                    errorToast(response.message)
                }
            })
        }
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 py-24 rounded-lg shadow-md">
                <div className="flex justify-center items-center mb-8">
                    <Image src={"/images/logo.svg"} alt="logo" width={200} height={150} />
                </div>

                <div className="flex flex-col justify-center items-center mb-8" >
                    <p className='text-center text-black font-bold text-[20px] text-bold'>Reset Password?</p>
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-[#5E6366] text-[12px] font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:ring-2 focus:none"
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                        ) : null}
                    </div>

                    <div className="mb-4">
                        <label className="block text-[#5E6366] text-[12px] font-medium mb-2">Confirm password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:ring-2 focus:none"
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white mt-3 py-2 rounded-md hover:bg-gray-800"
                    >
                        {
                            loading ? <ActivityLoader />
                                : "Reset Password"
                        }

                    </button>
                </form>

            </div>
        </div>
    )
}

export default ResetPassword