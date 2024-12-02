import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
import StoreProvider from './StoreProvider';
import Script from 'next/script';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bargn",
  description: "Business account",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const apiKey = process.env.GOOGLE_API_KEY;

  return (
    <html lang="en">
      {/* <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
          async
          defer
        ></script>
      </Head>; */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        <StoreProvider >
          {children}
        </StoreProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
