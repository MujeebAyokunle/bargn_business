"use client"
import Nav from '@/components/Nav'
import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from 'react-icons/gr'
import { useSocket } from "../../helper/socket"
import { useAppSelector } from '@/lib/hooks'

function support() {

    const { socket }: any = useSocket()
    const messagesRef = useRef<HTMLDivElement>(null);
    const { userData } = useAppSelector((data) => data.business)

    const [inputValue, setInputValue] = useState("");
    // const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Array<string>>([])

    useEffect(() => {

        socket.current.emit('join_room', userData?.business_id)

        socket.current.on('receive_message', (data: any) => {
            setMessages(data?.chats);
        });

        return () => {
            socket.current.off('receive_message');
        };
    }, []);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight + 20
        }
    }, [messages, messages?.length]);


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            // Call your function here
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (inputValue) {
            socket.current.emit('send_message', {
                text: inputValue,
                business: true,
                room: userData?.business_id,
                business_id: userData?.business_id
            });
            setInputValue("");
        }
    };

    return (
        <Nav>
            {/* style={{height: "var()"}} */}
            <div className='h-screen relative flex-1 pt-20' >
                {/* <p className='text-[#0A0909] font-bold text-[20px]' >Support Center</p> */}

                <div className='fixed top-16 bg-[#F3F4F6] left-[17%] right-3 z-10'>
                    <p className='text-[#0A0909] font-bold text-[20px] p-4'>Support Center</p>

                    <div className='flex items-center space-x-2 bg-[#6366F1] p-4 w-full'>
                        <img src="/images/bargn_logo.png" alt="bargn_logo" className='w-[48px] h-[48px] rounded-[24px]' />
                        <div>
                            <p className='text-white font-bold text-base'>Bargn Support</p>
                            <p className='text-[#f3f3f3] font-normal text-sm'>Available 24/7</p>
                        </div>
                    </div>
                </div>

                <div ref={messagesRef} className='p-2 space-y-2 pb-20 pt-20 flex-1 h-full overflow-y-auto' >
                    {
                        messages?.map((message: any, index: number) => (
                            <>
                                {
                                    message?.message ? (
                                        <div key={index} className={`flex ${message?.sender == userData?.business_id ? "justify-end" : "justify-start"}`} >
                                            <div className={message?.sender == userData?.business_id ? `bg-[#B2B2B2] p-3 rounded-tl-lg max-w-[65%] rounded-tr-lg rounded-bl-lg` : `max-w-[65%] bg-[#EEF1F6] rounded-lg p-3 border`} >
                                                <p className='text-[#1E1E1E] font-normal text-base' >{message?.message}</p>
                                            </div>
                                        </div>
                                    ) : null
                                }
                            </>
                        ))
                    }                    
                </div>

                {/* Chet section */}
                <div className='fixed bottom-6 left-[17%] right-3 p-2 px-4 rounded-lg mx-4 bg-white flex items-center'>
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        type="text"
                        className='w-full text-black text-sm h-8 focus:outline-none'
                    />
                    <GrAttachment className='cursor-pointer' color='#6C7893' size={16} />
                </div>
            </div>
        </Nav>
    )
}

export default support