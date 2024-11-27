"use client"
import { signInApi } from "@/apis";
import ActivityLoader from "@/components/ActivityLoader";
import { errorToast, successToast } from "@/helper/functions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEyeOff } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";

export default function Home() {

  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const signIn = async (e: any) => {
    e.preventDefault()

    let json = {
      email,
      password
    }
    setLoading(true)
    console.log(json)
    signInApi(json, response => {
      setLoading(false)

      if (!response?.error) {
        successToast(response?.message)
        router.push("/dashboard")
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
          <span className="mx-4 text-gray-500 text-sm">Or Continue With Email</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form onSubmit={signIn}>
          <div className="mb-4">
            <label className="block text-[#5E6366] text-[12px] font-medium mb-2">Business Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:ring-2 focus:none"
              placeholder="sales@hideoutvillas.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#5E6366] text-[12px] font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters and must contain at least a <span className="text-[#32936F] font-medium">Capital Letter</span>, a <span className="text-[#32936F] font-medium">Number</span> and a <span className="text-[#32936F] font-medium">Special Character</span>.
            </p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-indigo-500" />
              <span className="ml-2 text-sm text-gray-700">Remember me</span>
            </label>
            <Link href="/forgotpassword" className="text-sm text-[#EC221F] hover:underline">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
          >
            {
              loading ?
                <ActivityLoader />
                : "Log In"
            }
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-700">
            Don’t have an account? <Link href="/signup" className="text-[#3A5AFF] hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
