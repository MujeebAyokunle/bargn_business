"use client"
import { fetchBusinessDetails, resetPasswordAPI, sendOTPApi, UpdateLanguageApi, UpdateMessageNotificationApi } from '@/apis'
import ActivityLoader from '@/components/ActivityLoader'
import CustomSwitch from '@/components/CustomSwitch'
import Modal from '@/components/Modal'
import { errorToast, successToast, validateEmail } from '@/helper/functions'
import { updateNotificationMode } from '@/lib/features/businessSlice'
import { useAppSelector } from '@/lib/hooks'
import { channel } from 'diagnostics_channel'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaFacebookF } from 'react-icons/fa'
import { FiEyeOff } from 'react-icons/fi'
import { IoEyeOutline } from 'react-icons/io5'
import { useDispatch } from 'react-redux'

function Settings() {

    const dispatch: any = useDispatch()
    const { businessDetails } = useAppSelector((data: any) => data.business)

    // states
    const [messageNotification, setMessageNotification] = useState(false)
    const [emailNotification, setEmailNotification] = useState(false)
    const [emailEror, setEmailError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [openEmailModal, setOpenEmailModal] = useState(false)
    const [openPasswordResetModal, setOpenPasswordResetModal] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [resetLoading, setResetLoading] = useState(false)
    const [confirmError, setConfirmError] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [openResetSuccessfulModal, setOpenResetSuccessfulModal] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [otp, setOtp] = useState("")

    useEffect(() => {
        setEmailNotification(businessDetails?.email_notification == "true")
        setMessageNotification(businessDetails?.text_notification == "true")
    }, [businessDetails])

    const setMessageNotApi = (value: boolean, method: string) => {
        if (method == "text_notification") {
            setMessageNotification(value)
        } else {
            setEmailNotification(value)
        }

        let json = {
            value,
            notification_medium: method
        }

        UpdateMessageNotificationApi(json, response => {

            if (!response.error) {
                successToast(response?.message)

                let json = {
                    notification_method: method,
                    value
                }
                dispatch(updateNotificationMode(json))
            } else {
                errorToast(response?.message)
                if (method == "text_notification") {
                    setMessageNotification(!value)
                } else {
                    setEmailNotification(!value)
                }
            }
        })
    }

    // Update language
    const updateLanguage = (event: any) => {

        let json = {
            language: event.target.value
        }

        UpdateLanguageApi(json, response => {

            if (!response.error) {
                successToast(response?.message)

                let json = {
                    notification_method: "language",
                    value: event.target.value
                }
                dispatch(updateNotificationMode(json))
            } else {
                errorToast(response?.message)
            }
        })
    }

    // Send change Password OTP
    const sendPasswordOTP = async () => {

        const error = validateEmail(email);

        if (error) {
            setEmailError(true)
            return
        }

        if (email !== businessDetails?.business_email) {
            errorToast("Invalid business email")
            return
        }
        setLoading(true)
        let json = {
            channel: "email",
            email
        }

        sendOTPApi(json, response => {
            setLoading(false)

            if (!response?.error) {
                successToast(response?.message)
                setOpenEmailModal(false)
                setOpenPasswordResetModal(true)
            } else {
                errorToast(response?.message)
            }
        })
    }

    // resetPassword
    const resetPasswordFunc = () => {
        let errors: any = {};

        // Validate OTP
        if (!otp.trim()) {
            errors.otp = "OTP is required.";
        } else if (otp.length !== 4) {
            errors.otp = "Invalid OTP. It must be a 4-digit number.";
        }

        // Validate new password
        if (!newPassword.trim()) {
            errors.newPassword = "New password is required.";
        } else if (newPassword.length < 8) {
            errors.newPassword = "Password must be at least 8 characters long.";
        } else if (!/[A-Z]/.test(newPassword)) {
            errors.newPassword = "Password must contain at least one capital letter.";
        } else if (!/\d/.test(newPassword)) {
            errors.newPassword = "Password must contain at least one number.";
        } else if (!/[!@#$%^&*]/.test(newPassword)) {
            errors.newPassword = "Password must contain at least one special character.";
        }

        // Validate confirm password
        if (!confirmPassword.trim()) {
            errors.confirmPassword = "Confirm password is required.";
        } else if (newPassword !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        // Set errors or submit
        if (Object.keys(errors).length > 0) {
            setConfirmError(errors.confirmPassword ? true : false);
            console.log(errors); // Display errors
            return
        }
        console.log({ errors })
        console.log("loading")
        setResetLoading(true)

        let json = {
            newPassword,
            token: otp,
            email
        }

        resetPasswordAPI(json, response => {
            setResetLoading(false)
            if (!response?.error) {
                setEmail("")
                setOtp("")
                setNewPassword("")
                setConfirmPassword("")
                successToast(response?.message)
                setOpenPasswordResetModal(false)
                setOpenResetSuccessfulModal(true)
            } else {
                errorToast(response?.message)
            }
        })
    }

    return (
        <div className='mx-4 my-12' >
            <div className="w-full bg-white shadow-lg rounded-lg p-12">
                <p className="text-[20px] font-bold mb-6 text-black">Settings</p>

                {/* Change password Section */}
                <div className="mb-6 border border-[#979797] rounded-lg p-4">
                    <label className="block text-[16px] font-normal text-[#5e6366] mb-1 ">Change Password</label>
                    <div className='mt-1 space-x-4 flex items-center' >
                        <input
                            type="text"
                            value="******"
                            disabled
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 cursor-not-allowed"
                        />

                        <div onClick={() => setOpenEmailModal(true)} className='px-3 py-[7px] cursor-pointer border border-[#979797] rounded' >
                            <p className='text-black font-medium text-[16px]' >Change</p>
                        </div>
                    </div>
                </div>

                {/* Language Section */}
                <div className="mb-6 border border-[#979797] rounded-lg p-4">
                    <h3 className="text-[20px] text-black font-medium mb-2">Language</h3>
                    <label className="block text-[12px] text-[#5e6366] mb-1 ">Choose Language</label>
                    <select value={businessDetails?.language} onChange={updateLanguage} className="w-full text-black text-[16px] border border-[#979797] focus:outline-none rounded-lg px-3 py-2">
                        <option value={"english"}>English</option>
                        <option value={"finnish"}>Finnish</option>
                        {/* Add more options as needed */}
                    </select>
                </div>

                {/* Notifications Section */}
                <div className="mb-6 border border-[#979797] rounded-lg p-4">
                    <h3 className="text-[20px] text-black font-medium mb-2">Notifications</h3>
                    <div className='flex justify-between items-center' >
                        <p className="block text-[12px] text-[#5e6366] mb-1 ">Choose notifications method</p>

                    </div>

                    {/* Text Messages */}
                    <div className="flex items-center justify-between mb-4">
                        <div className='w-full'>
                            <label className="font-medium text-[16px] text-[#2c2c2c] mb-1 ">Text Messages</label>
                            <div className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 mt-1" >
                                <p className='text-[#5E6366] font-normal text-[16px]' >+{businessDetails?.phone_country_code}-{businessDetails?.phone_number}</p>

                                <CustomSwitch onToggle={(val: boolean) => setMessageNotApi(val, "text_notification")} isOn={messageNotification} />
                            </div>

                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="flex items-center justify-between">
                        <div className='w-full'>
                            <label className="font-medium text-[16px] text-[#2c2c2c] mb-1 ">Email Address</label>
                            <div className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 mt-1" >
                                <p className='text-[#5E6366] font-normal text-[16px]' >{businessDetails?.business_email}</p>

                                <CustomSwitch onToggle={(val: boolean) => setMessageNotApi(val, "email_notification")} isOn={emailNotification} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Socials Section */}
                <div className="border border-[#979797] rounded-lg p-4">
                    <h3 className="text-[20px] text-black font-medium mb-2">Socials</h3>
                    <p className="block text-[12px] text-[#5e6366] mb-1 ">Link your social profiles</p>

                    {/* Social Links */}
                    <div className="space-y-4 mt-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 border border-[#979797] rounded flex items-center justify-center">
                                    <FaFacebookF size={18} color='blue' />
                                </div>
                                <span className="text-gray-800">Facebook</span>
                            </div>
                            {
                                businessDetails?.fecebook ? (
                                    <p className='text-[#AF52DE] text-sm' >{businessDetails?.facebook}</p>
                                ) : (
                                    <button className="text-sm text-[#AF52DE] font-medium">Connect</button>
                                )
                            }
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 border border-[#979797] rounded flex items-center justify-center">
                                    <Image src={"/images/instagram.png"} alt='instagram' height={20} width={20} />
                                </div>
                                <span className="text-gray-800">Instagram</span>
                            </div>

                            {
                                businessDetails?.instagram ? (
                                    <p className='text-[#AF52DE] text-sm' >{businessDetails?.instagram}</p>
                                ) : (
                                    <button className="text-sm text-[#AF52DE] font-medium">Connect</button>
                                )
                            }
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 border border-[#979797] rounded flex items-center justify-center">
                                    <Image src={"/images/x.png"} alt='instagram' height={20} width={20} />
                                </div>
                                <span className="text-gray-800">X fka (Twitter)</span>
                            </div>

                            {
                                businessDetails?.twitter ? (
                                    <p className='text-[#AF52DE] text-sm' >{businessDetails?.twitter}</p>
                                ) : (
                                    <button className="text-sm text-[#AF52DE] font-medium">Connect</button>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>

            {/* Email modal */}
            {
                openEmailModal && (
                    <Modal close={() => {
                        setEmailError(false)
                        setOpenEmailModal(false)
                    }} >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-[24px] text-center font-semibold text-[#1e1e1e]" id="modal-title">Enter Email</h3>
                                    <div className="mt-1">
                                        <p className="text-base font-normal text-center text-[#757575]">Enter the e-mail address for this account, we’ll send a One Time Password to that email</p>
                                    </div>

                                    <div className='my-4' >
                                        <p className='text-[#757575] font-normal text-[12px]' >Business Email</p>
                                        <input onBlur={(event) => {
                                            let validate = validateEmail(event.target.value)

                                            if (validate) { setEmailError(true) } else setEmailError(false)
                                        }} onChange={(e) => {
                                            const { value } = e.target;
                                            setEmail(value);
                                        }} type="email" className={`border ${emailEror ? "border-[#F75351]" : "border-[#757575]"} rounded-md w-full p-2 my-1 text-base text-black focus:outline-none`} />
                                        {
                                            emailEror &&
                                            <p className='text-[#F75351] font-normal text-[12px]' >Invalid email, please check the email.</p>
                                        }
                                    </div>

                                    {/* Submit button */}
                                    <button onClick={() => {
                                        let validate = validateEmail(email)

                                        if (!validate) {
                                            sendPasswordOTP()
                                        }

                                    }} type="submit" style={{ width: "100%", marginTop: 20 }} className={`mb-3 mt-10 w-full justify-center rounded-md ${email && !validateEmail(email) ? "bg-[#000]" : "bg-[#D9D9D9]"} px-3 py-3 text-sm font-semibold ${email && !validateEmail(email) ? "text-[#fff]" : "text-[#B3B3B3]"} shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto`}>
                                        {
                                            loading ?
                                                <ActivityLoader />
                                                : "Send OTP"
                                        }

                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )
            }

            {/* Reset password modal */}
            {
                openPasswordResetModal && (
                    <Modal close={() => setOpenPasswordResetModal(false)} >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-[24px] text-center font-semibold text-[#1e1e1e]" id="modal-title">Reset Password</h3>

                                    <div className='my-4' >
                                        <p className='text-[#757575] font-normal text-[12px]' >Enter OTP</p>
                                        <div className="relative my-2">
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-full px-4 py-2 text-black border border-[#757575] rounded-md focus:outline-none focus:ring-2 focus:none"
                                            />

                                            <div className='flex justify-end items-end mt-2' >
                                                <p className='cursor-pointer text-[12px] text-blue-500' onClick={sendPasswordOTP} >Resend OTP</p>
                                            </div>
                                        </div>

                                        <p className='text-[#757575] font-normal text-[12px]' >Enter new password</p>
                                        <div className="relative my-2">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-2 text-black border border-[#757575] rounded-md focus:outline-none focus:ring-2 focus:none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                            >
                                                {!showPassword ? <FiEyeOff /> : <IoEyeOutline />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Password must be at least 8 characters and must contain at least a <span className="text-[#32936F] font-medium">Capital Letter</span>, a <span className="text-[#32936F] font-medium">Number</span> and a <span className="text-[#32936F] font-medium">Special Character</span>.
                                        </p>
                                    </div>

                                    <div className='my-4' >
                                        <p className='text-[#757575] font-normal text-[12px]' >Confirm new password</p>
                                        <div className="relative my-2">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-2 text-black border border-[#757575] rounded-md focus:outline-none focus:ring-2 focus:none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                            >
                                                {!showConfirmPassword ? <FiEyeOff /> : <IoEyeOutline />}
                                            </button>
                                        </div>

                                        {
                                            confirmError && (
                                                <p className='text-[#F75351] font-normal text-[12px]' >Passwords do not match</p>
                                            )
                                        }
                                    </div>

                                    {/* Submit button */}
                                    <button onClick={resetPasswordFunc} type="submit" style={{ width: "100%", marginTop: 20 }} className="mb-3 mt-10 w-full justify-center rounded-md bg-[#000] px-3 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto">
                                        {
                                            resetLoading ? <ActivityLoader />
                                                : "Reset Password"
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )
            }

            {/* Congratulations modal */}
            {
                openResetSuccessfulModal && (
                    <Modal close={() => setOpenResetSuccessfulModal(false)} >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className='flex flex-col items-center justify-center w-full' >
                                    <p className='text-[50px]'>
                                        🎉
                                    </p>

                                    <p className='text-black text-[28px] text-center font-semibold' >Passwor Updated <br />Successfully</p>

                                    <p className='text-[#A2A1AB] text-base font-normal' >Your password has been updated successfully.</p>

                                    <div onClick={() => setOpenResetSuccessfulModal(false)} className='bg-black rounded-md p-2 mt-8 mb-4 w-full' >
                                        <p className='text-[#F5F5F5] text-base text-center font-normal' >Back to Dashbosrd</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )
            }
        </div >
    )
}

export default Settings