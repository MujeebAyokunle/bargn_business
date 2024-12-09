"use client"
import Nav from '@/components/Nav.tsx'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

function layout({ children }: any) {

    const router = useRouter()
    const pathName = usePathname()

    const navigateFunc = (url: string) => {
        router.push(url)
    }

    return (
        <Nav >
            <div className='p-4'>
                <div className="mb-6 w-full">
                    <h1 className="text-2xl text-[#0A0909] font-bold">Account Settings</h1>

                    {/* nav tab view */}
                    <div className='flex items-center mt-8 space-x-6 border-b border-b-[#A5A5A5]' >
                        <div onClick={() => navigateFunc("/settings/profile")} className={`${pathName.includes("profile") && "border-b-[3px] border-b-black"} py-1 cursor-pointer`} >
                            <p className='text-black' >Profile</p>
                        </div>
                        <div onClick={() => navigateFunc("/settings")} className={`${!pathName.includes("ratings") && !pathName.includes("profile") && "border-b-[3px] border-b-black"} cursor-pointer py-1`}>
                            <p className='text-black'>Settings</p>
                        </div>
                        <div onClick={() => navigateFunc("/settings/ratings")} className={`${pathName.includes("ratings") && "border-b-[3px] border-b-black"} py-1 cursor-pointer`}>
                            <p className='text-black'>Ratings & Review</p>
                        </div>
                    </div>

                    <div className='my-4' >
                        {children}
                    </div>
                </div>
            </div>
        </Nav>
    )
}

export default layout