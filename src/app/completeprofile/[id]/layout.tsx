import Script from 'next/script'
import React, { ReactNode } from 'react'

function CompleteProfileLayout({ children }: { children: ReactNode }) {

    const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyD_hA8Lkcm7jjW6gM9_-VgZjD4O9DJr5dA";

    return (
        <>
            {/* <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
                strategy="beforeInteractive"
            /> */}
            
            {/* <script src={`https://maps.googleapis.com/maps/api/js?v=3.&libraries=places&key=${apiKey}`}></script> */}

            <div>{children}</div>
        </>
    )
}

export default CompleteProfileLayout