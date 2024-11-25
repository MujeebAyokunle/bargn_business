import Script from 'next/script'
import React, { ReactNode } from 'react'

function CompleteProfileLayout({ children }: { children: ReactNode }) {

    const apiKey = process.env.GOOGLE_API_KEY;

    return (
        <>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
                strategy="beforeInteractive"
            />

            <div>{children}</div>
        </>
    )
}

export default CompleteProfileLayout