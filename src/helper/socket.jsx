"use client"
import { useEffect, useRef } from "react"
import io from 'socket.io-client';

export const useSocket = () => {
    const socket = useRef(null)


    useEffect(() => {
        socket.current = io('https://52.90.12.51.nip.io/', {
            auth: {
                token: localStorage.getItem("authToken")
            },
        });
        // socket.on('receive_message', (data) => {
        //     console.log(data);
        // });

        // return () => {
        //     socket.off('receive_message');
        // };
    }, [])

    return { socket }
}