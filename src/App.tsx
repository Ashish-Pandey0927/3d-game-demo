// import React from 'react'
import Navbar from './components/navbar'
import gsap from 'gsap'
import Model from './components/model'
const App = () => {
  const t1 = gsap.timeline({ defaults: { duration: 2} })
  t1.fromTo(".title", { opacity: 0 }, { opacity: 1 })
  

  return (
    <div>
      <Navbar />
      <Model />
      {/* <Model /> */}
      {/* <h2 className='bg-black text-white absolute text-[4rem] left-[50%] top-[20%] font-bold title'>Give it a Spin</h2> */}
      {/* <3dobject /> */}
    </div>
  )
}

export default App
