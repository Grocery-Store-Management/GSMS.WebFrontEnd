import React from 'react';
import { Oval } from 'react-loader-spinner'
import { Backdrop } from '@windmill/react-ui'
export const pageLoader = () => {
    return <div className="relative" >
        <Backdrop />
        <div className='absolute' style={{ left: "25vw", top:"30vh"}}>
            <Oval height="60%"
                width="60%"
                color='red'
                ariaLabel='loading' />
        </div>
    </div>;
}