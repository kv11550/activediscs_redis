import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

const MessageBox = (props: any) => {

    const messageToShow = useSelector((state: any) => state.messageToShow);

    useEffect(
        () => {
            if (messageToShow.payload) {
                toast(`${messageToShow.payload}`, {
                    duration: 2000,
                    position: 'bottom-center',
                    style: {
                        background: '#8bc34a',
                        color: 'white'

                    },
                    icon: '👏',
                });
            }
        }, [messageToShow]
    );

    return (
        <Toaster />
    )
};

export default MessageBox;