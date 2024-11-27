"use client"
import Nav from '@/components/Nav.tsx'
import { LineChart } from '@/components/Svgs/icons'
import React from 'react'
import { Doughnut } from 'react-chartjs-2';
import { GrShare } from 'react-icons/gr';
import { Chart, ArcElement } from 'chart.js';
import { SlOptions, SlOptionsVertical } from 'react-icons/sl';
import { CiFilter } from 'react-icons/ci';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const data = {
    labels: ["Group A", "Group B", "Group C"],
    datasets: [
        {
            data: [300, 500, 200],
            backgroundColor: ["#F18963", "#D1D117", "#F881CA"],
            hoverBackgroundColor: ["#FF8A80", "#FFE57F", "#CE93D8"],
        },
    ],
};

const statusStyles: any = {
    Completed: "bg-[#F0FDF4] text-[#22c55e]",
    Processing: "bg-[#FFFBEB] text-[#F59E0B]",
    Shipping: "bg-[#EEF2FF] text-[#6366F1]",
};

const data2 = [
    {
        order: "03-495837521",
        deal: "Skiing and Snowboarding",
        amount: "€170.00",
        status: "Completed",
        image: "https://via.placeholder.com/40", // Replace with actual image URL
    },
    {
        order: "03-495837522",
        deal: "Northern Lights Hunting",
        amount: "€140.90",
        status: "Processing",
        image: "https://via.placeholder.com/40",
    },
    {
        order: "03-495837523",
        deal: "Snowmobiling",
        amount: "€120.00",
        status: "Shipping",
        image: "https://via.placeholder.com/40",
    },
    // Add more rows as needed
];

const salesData = [
    {
        title: "Recent",
        items: [
            {
                name: "Esther Howard",
                location: "HiddenVille",
                amount: "€4613",
                avatar: "https://via.placeholder.com/40",
            },
            {
                name: "Darlene Robertson",
                location: "Uusimaa, Helsinki, Finland",
                amount: "€31,687",
                avatar: "https://via.placeholder.com/40",
            },
            {
                name: "Leslie Alexander",
                location: "Helsinki, Finland",
                amount: "€4613",
                avatar: "https://via.placeholder.com/40",
            },
        ],
    },
    {
        title: "Yesterday",
        items: [
            {
                name: "Robert Fox",
                location: "Northern Ostrobothnia, Oulu",
                amount: "€170.00",
                avatar: "https://via.placeholder.com/40",
            },
            {
                name: "Bessie Cooper",
                location: "Forssa, Helsinki",
                amount: "€170.00",
                avatar: "https://via.placeholder.com/40",
            },
        ],
    },
    {
        title: "Last Week",
        items: [
            {
                name: "Robert Fox",
                location: "Northern Ostrobothnia, Oulu",
                amount: "€170.00",
                avatar: "https://via.placeholder.com/40",
            },
            {
                name: "Bessie Cooper",
                location: "Forssa, Helsinki",
                amount: "€170.00",
                avatar: "https://via.placeholder.com/40",
            },
        ],
    },
    {
        title: "Last Month",
        items: [
            {
                name: "Esther Howard",
                location: "HiddenVille",
                amount: "€4613",
                avatar: "https://via.placeholder.com/40",
            },
            {
                name: "Darlene Robertson",
                location: "Uusimaa, Helsinki, Finland",
                amount: "€90,012",
                avatar: "https://via.placeholder.com/40",
            },
        ],
    },
];

const options = {
    cutout: "70%", // Creates the donut effect
    plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
    },
};

function Dashboard() {

    Chart.register(ArcElement)

    return (
        <Nav>
            <div className='p-4'>
                <div className="mb-6 w-full">
                    <h1 className="text-2xl text-[#0A0909] font-bold">Analytics</h1>

                    <div className='flex'>
                        {/* Left side metrics (Deals Analytics metrics) */}
                        <div className='w-[69%] mt-4'>
                            {/* Revenue analytics */}
                            <div className='flex w-full mb-4'>
                                <div className='w-[33.33%] p-4 border bg-white border-[#D9D9D9] rounded-tl-lg space-y-1 rounded-bl-lg'>
                                    <p className='text-[#6B7280] font-medium text-[16px]'>Active Deals</p>
                                    <p className='text-[#1F2937] font-bold text-[32px]'>3</p>

                                    <div className='flex items-center space-x-1'>
                                        <div className='flex flex-row justify-center items-center space-x-2 bg-[#F0FDF4] px-2 rounded-full'>
                                            <LineChart />
                                            <p className='text-[#22C55E] text-[12px] font-medium'>3%</p>
                                        </div>
                                        <p className='text-[#1F2937] text-[14px] font-normal'>from last month</p>
                                    </div>
                                </div>
                                <div className='w-[33.33%] space-y-1 p-4 border bg-white border-[#D9D9D9]'>
                                    <p className='text-[#6B7280] font-medium text-[16px]'>Redeemed Deals</p>
                                    <p className='text-[#1F2937] font-bold text-[32px]'>4234</p>

                                    <div className='flex items-center space-x-1'>
                                        <div className='flex flex-row justify-center items-center space-x-2 bg-[#F0FDF4] px-2 rounded-full'>
                                            <LineChart />
                                            <p className='text-[#22C55E] text-[12px] font-medium'>3%</p>
                                        </div>
                                        <p className='text-[#1F2937] text-[14px] font-normal'>from last month</p>
                                    </div>
                                </div>
                                <div className='w-[33.33%] p-4 space-y-1 border bg-white border-[#D9D9D9] rounded-tr-lg rounded-br-lg'>
                                    <p className='text-[#6B7280] font-medium text-[16px]'>Total Revenue</p>
                                    <p className='text-[#1F2937] font-bold text-[32px]'>€ 36,453</p>

                                    <div className='flex items-center space-x-1'>
                                        <div className='flex flex-row justify-center items-center space-x-2 bg-[#F0FDF4] px-2 rounded-full'>
                                            <LineChart />
                                            <p className='text-[#22C55E] text-[12px] font-medium'>3%</p>
                                        </div>
                                        <p className='text-[#1F2937] text-[14px] font-normal'>from last month</p>
                                    </div>
                                </div>
                            </div>

                            {/* Deals overview */}
                            <div className='p-4 border bg-white border-[#D9D9D9] rounded-lg '>
                                <div className='flex justify-between items-center' >
                                    <p className='text-[#6B7280] text-[16px] font-medium'>Deals Overview</p>
                                    <div className='flex justify-center items-center space-x-1 p-2'>
                                        <p className='text-[#6366F1] p-0 text-[12px] font-medium'>View more</p>
                                        <GrShare color='#6366F1' size={15} />
                                    </div>
                                </div>

                                <div className='my-6 flex'>
                                    <div className='justify-center items-center flex w-[40%]' >
                                        <div className='relative h-[180px] w-[180px]'>
                                            <Doughnut data={data} options={options} />
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <strong className='text-[#1F2937] text-[10px]'>Redeemed Deals</strong>
                                                <div className='text-[#1F2937] font-bold text-[13px]' >4234</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-[60%]'>
                                        <div className='flex justify-between items-center'>
                                            <p className='text-[#1F2937] text-[12px] font-medium'>Active Deals</p>

                                            <SlOptions color='#1F2937' />
                                        </div>

                                        <div className=' mt-3 flex items-center space-x-2'>
                                            <img src="/images/deal_image.png" className='w-[30px] h-[30px] rounded' alt="image" />
                                            <div className='flex flex-col space-y-1 items-center justify-between w-full'>
                                                <div className='flex items-center w-full justify-between' >
                                                    <p className='text-[#111827] text-[10px] font-medium' >Skiing and snowboarding</p>

                                                    <p className='text-[#111827] text-[10px] font-medium'>23%</p>
                                                </div>
                                                <div className='bg-[#E5E7EB] h-[4px] rounded-full w-full' >
                                                    <div className='bg-[#F881CA] w-[40%] h-full ' />
                                                </div>
                                            </div>
                                        </div>
                                        <div className=' mt-3 flex items-center space-x-2'>
                                            <img src="/images/deal_image.png" className='w-[30px] h-[30px] rounded' alt="image" />
                                            <div className='flex flex-col space-y-1 items-center justify-between w-full'>
                                                <div className='flex items-center w-full justify-between' >
                                                    <p className='text-[#111827] text-[10px] font-medium' >Skiing and snowboarding</p>

                                                    <p className='text-[#111827] text-[10px] font-medium'>23%</p>
                                                </div>
                                                <div className='bg-[#E5E7EB] h-[4px] rounded-full w-full' >
                                                    <div className='bg-[#F18963] w-[40%] h-full ' />
                                                </div>
                                            </div>
                                        </div>
                                        <div className=' mt-3 flex items-center space-x-2'>
                                            <img src="/images/deal_image.png" className='w-[30px] h-[30px] rounded' alt="image" />
                                            <div className='flex flex-col space-y-1 items-center justify-between w-full'>
                                                <div className='flex items-center w-full justify-between' >
                                                    <p className='text-[#111827] text-[10px] font-medium' >Skiing and snowboarding</p>

                                                    <p className='text-[#111827] text-[10px] font-medium'>23%</p>
                                                </div>
                                                <div className='bg-[#E5E7EB] h-[4px] rounded-full w-full' >
                                                    <div className='bg-[#D1D117] w-[40%] h-full ' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-[15px] text-[#6B7280] font-medium">Sales Analytics Per Deals</h2>

                                    <div className='flex items-center space-x-2'>
                                        <div className="flex items-center gap-1 px-4 p-1 bg-white rounded-md border border-[#E5E7EB] text-gray-600">
                                            <CiFilter color='#1F2937' />
                                            Filter
                                        </div>
                                        <SlOptionsVertical color='#374151' />
                                    </div>
                                </div>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b text-gray-600">
                                            <th className="py-3 px-4">
                                                <input type="checkbox" className="rounded" />
                                            </th>
                                            <th className="py-3 text-[#374151] text-[13.8px] font-medium px-4">Order Number</th>
                                            <th className="py-3 text-[#374151] text-[13.8px] font-medium px-4">Deals</th>
                                            <th className="py-3 text-[#374151] text-[13.8px] font-medium px-4">Amount</th>
                                            <th className="py-3 text-[#374151] text-[13.8px] font-medium px-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data2.map((item, index) => {
                                            console.log(statusStyles[item.status])
                                            return (
                                                <tr key={index} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <input type="checkbox" className="rounded border-[#D1D5DB]" />
                                                    </td>
                                                    <td className="py-3 text-[13.81px] text-[#111827] px-4">{item.order}</td>
                                                    <td className="py-3 px-4 text-[13.81px] text-[#111827] flex items-center gap-3">
                                                        <img
                                                            src={item.image}
                                                            alt={item.deal}
                                                            className="w-10 h-10 rounded-md"
                                                        />
                                                        {item.deal}
                                                    </td>
                                                    <td className="py-3 text-[13.81px] text-[#111827] px-4">{item.amount}</td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm ${statusStyles[item.status]}`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                {/* Pagination */}
                                <div className="m-4 flex space-x-1 justify-between items-center mt-6">
                                    <button className="px-4 flex items-center justify-center py-2 bg-[#F9FAFB] border border-[#E5E7EB] text-gray-700 rounded-lg hover:bg-gray-300">
                                        <FiChevronLeft size={20} />
                                        Previous
                                    </button>
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5, "...", 40].map((page, index) => (
                                            <button
                                                key={index}
                                                className={`px-3 py-2 rounded-lg ${page === 5
                                                    ? "bg-[#EEF2FF] border border-[#6366f1] text-[#6366f1]"
                                                    : "bg-[#F9FAFB] border border-[#E5E7EB] text-gray-700 hover:bg-gray-300"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button className="px-2 py-2 flex justify-center items-center space-x-2 bg-[#F9FAFB] border border-[#E5E7EB] text-gray-700 rounded-lg hover:bg-gray-300">
                                        Next
                                        <FiChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right side metrics (sales history) */}
                        <div className='w-[29%] mt-4 ml-[2%]'>
                            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales History</h2>
                                {salesData.map((section) => (
                                    <div key={section.title} className="mb-6">
                                        <h3 className="text-[#6B7289] text-[12px] font-medium mb-3">{section.title}</h3>
                                        <ul className="space-y-4">
                                            {section.items.map((item, index) => (
                                                <li key={index} className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={item.avatar}
                                                            alt={item.name}
                                                            className="w-10 h-10 rounded-full mr-3"
                                                        />
                                                        <div>
                                                            <p className="text-[#404040] text-[14px] font-semibold">{item.name}</p>
                                                            <p className="text-[#565656] text-[12px] font-medium">{item.location}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-[#1F2937] font-medium text-[14px]">{item.amount}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Nav>
    )
}

export default Dashboard