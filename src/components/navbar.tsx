// import React from 'react'
import gsap from 'gsap'

const navbar = () => {
  const t1 = gsap.timeline({ defaults: { duration: 1} })
  t1.fromTo("nav", { y: "-100%" }, { y: "0%" })
  
  return (
    <nav className='bg-transparent text-white flex gap-10 justify-center h-16 items-center z-20 relative'>
      <div className='relative -left-64 text-[1.7rem]'>Ashish Pandey</div>
      <div className='relative left-64'>
        <ul className='flex gap-20 text-[1.4rem] '>
            <li className='cursor-pointer'>Home</li>
            <li className='cursor-pointer'>Service</li>
            <li className='cursor-pointer'>About</li>
            <li className='cursor-pointer'>contact</li>
        </ul>
      </div>
    </nav>
  )
}

export default navbar
