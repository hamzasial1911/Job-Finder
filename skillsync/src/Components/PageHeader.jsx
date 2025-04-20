import React from 'react'

const PageHeader = ({title, path}) => {
  return (
    <div className='py-8 mt-3 bg-[#FAFAFA] rounded flex items-center justify-center'>
        <div>
            <h1 className='text-3x1 text-secondary font-bold mb-1 text-center'>{title}</h1>
            <p className='text-sm text-center'><a href="/">Home</a> / {path}</p>
        </div>
    </div>
  )
}

export default PageHeader