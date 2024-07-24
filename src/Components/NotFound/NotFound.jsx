import React from 'react'
import img from '../../assets/images/error.svg'


export default function NotFound() {
  return <>
    <div className='text-center py-5'>
      <img className='w-50' src={img} alt="404-error" />
    </div>
  </>
}
