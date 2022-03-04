import React from 'react';
import { Oval } from 'react-loader-spinner'
import { Backdrop } from '@windmill/react-ui'
export const pageLoader = () => {
    return (
        <div className="absolute">
            <Backdrop />
            <div className='relative' style={{ left: "25vw", top: "30vh", display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', zIndex: 1000 }}>
                <div className='mb-2' style={{ color: 'white' }}>Đang tải dữ liệu...</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <Oval
                        color='#2992f0'
                        secondaryColor='#fff'
                        strokeWidth={6}
                        ariaLabel='loading' />
                </div>
            </div>
        </div>
    );
}