"use client"
import React, { useState } from 'react'
import { signUpApi } from '@/apis';
import { errorToast } from '@/helper/functions';
import { Formik } from 'formik';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { FiEyeOff } from 'react-icons/fi';
import { IoEyeOutline } from 'react-icons/io5';
import { ClipLoader } from 'react-spinners';
import { ColorSchema } from '@/helper/colorScheme';

interface PayloadSchema {
    email: string
    password: string
    confirmPassword?: string
}

const initialValues = {
    email: "",
    password: "",
    confirmPassword: ""
};

const validate = (values: PayloadSchema) => {
    let errors: Partial<PayloadSchema> = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!values.email) {
        errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
        errors.email = "Invalid Email";
    }
    if (!values.password) {
        errors.password = "Password is required";
    } else if (!passwordRegex.test(values.password)) {
        errors.password = "Password too short";
    }

    if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
};

function SignUp() {

    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    const submitForm = (values: PayloadSchema) => {
        setLoading(true)
        let json = {
            email: values.email,
            password: values.password
        }

        signUpApi(json, response => {
            setLoading(false)
            if (!response?.error) {
                window.sessionStorage.setItem("email", values.email)
                router.push("/accountcreated")
            } else {
                errorToast(response?.message)
            }
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-center items-center mb-8">
                    <Image src={"images/logo.svg"} alt="logo" width={200} height={150} />
                </div>

                <div>
                    <p className='text-center text-black mb-3 font-bold text-[18px]'>Create your account</p>
                </div>

                <div className="flex justify-center gap-4 mb-4">
                    <button className="p-2 border-2 rounded-lg border-gray-100 hover:border-gray-200">
                        <Image src={"/images/google.jpg"} height={20} width={20} alt="google_login" />
                    </button>
                    <button className="p-2 border-2 rounded-lg border-gray-100 hover:border-gray-200">
                        <Image src={"/images/facebook.jpg"} height={20} width={20} alt="google_login" />
                    </button>
                    <button className="p-2 border-2 rounded-lg border-gray-100 hover:border-gray-200">
                        <Image src={"/images/linkedin.jpg"} height={20} width={20} alt="google_login" />
                    </button>
                </div>

                <div className="flex items-center justify-center mb-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-4 text-gray-500 text-sm">Or Start With Email</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                <Formik
                    initialValues={initialValues}
                    validate={validate}
                    onSubmit={submitForm}
                >
                    {(formik) => {
                        const {
                            values,
                            handleChange,
                            handleSubmit,
                            errors,
                            touched,
                            handleBlur,
                            isValid,
                            dirty
                        } = formik;

                        return (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-[#5E6366] text-[12px] font-medium mb-2">Business Email</label>
                                    <input
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        id="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:ring-2 focus:none"
                                        placeholder="sales@hideoutvillas.com"
                                    />

                                    {errors.email && touched.email && (
                                        <span className="error text-red-500 text-[12px]">{errors.email}</span>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-[#5E6366] text-[12px] font-medium mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={values.password}
                                            name="password"
                                            id="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:none"
                                            placeholder="Password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                        >
                                            {showPassword ? <FiEyeOff /> : <IoEyeOutline />}
                                        </button>
                                    </div>
                                    {errors.password && touched.password && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Password must be at least 8 characters and must contain at least a <span className="text-[#32936F] font-medium">Capital Letter</span>, a <span className="text-[#32936F] font-medium">Number</span> and a <span className="text-[#32936F] font-medium">Special Character</span>.
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-[#5E6366] text-[12px] font-medium mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={values.confirmPassword}
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:none"
                                            placeholder="Confirm password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                        >
                                            {showPassword ? <FiEyeOff /> : <IoEyeOutline />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && touched.confirmPassword && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <p className='text-[12px] text-[#757575]'>By signing up, you agree to our <span className='text-[#3E5AFF]'>Terms of Service</span> & <span className='text-[#3E5AFF]'>Privacy Policy</span>. </p>

                                </div>

                                <button
                                    disabled={!(dirty && isValid)}
                                    type="submit"
                                    className={`w-full bg-black text-white ${(dirty && isValid) && "cursor-pointer"} py-2 rounded-md hover:bg-gray-800`}
                                >
                                    {
                                        loading ?
                                            <ClipLoader color={ColorSchema.white} size={18} /> :
                                            "Create Account"
                                    }
                                </button>
                            </form>
                        );
                    }}
                </Formik>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-700">
                        Already have an account? <a href="/" className="text-[#3A5AFF] hover:underline">Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp