import React from 'react';
import { Oval } from 'react-loader-spinner'
import { Backdrop } from '@windmill/react-ui'
export const pageLoader = () => {
    return <div className="absolute" >
        <Backdrop />
        <div className='relative' style={{ left: "25vw", top:"30vh"}}>
            Đang tải dữ liệu! Xin vui lòng chờ!
            <Oval height="50%"
                width="60%"
                color='red'
                ariaLabel='loading' />
        </div>
    </div>;
}