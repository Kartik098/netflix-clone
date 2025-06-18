'use client'

import React, { use } from 'react'
import useMovie from '../../../../hooks/useMovie'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
interface WatchPageProps {
  params: Promise<{
    movieId: string
  }>
}

const Watch: React.FC<WatchPageProps> = ({ params }) => {
  const { movieId } = use(params); // ✅ unwrap Promise
  const { data } = useMovie(movieId)
  const router = useRouter()

  return (
    <div className='h-screen w-screen bg-black'>
      <nav className='fixed w-full p-4 z-10 flex flex-row items-center gap-8 bg-black bg-opacity-70'>
        <AiOutlineArrowLeft onClick={()=>{router.push("/")}} className='text-white cursor-pointer' size={40} />
        <p className='text-white text-1xl md:text-3xl font-bold'>
          <span className='font-light'>Watching:</span> {data?.title}
        </p>
      </nav>
      <video className='h-full w-full' autoPlay controls src={data?.videoUrl} ></video>

    </div>
  )
}

export default Watch
