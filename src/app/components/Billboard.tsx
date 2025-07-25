import React, { useCallback } from 'react'
import useBillboard from '../../../hooks/useBillboard'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import PlayButton from './PlayButton'
import useInfoModal from '../../../hooks/useInfoModal'
const Billboard = () => {
    const { data } = useBillboard()
    const { openModal } = useInfoModal()
    const handleOpenModal = useCallback(()=>{
      debugger
      openModal(data?.id)
      debugger
    },[openModal, data?.id])
    
  return (
    <div className='relative h-[56.25vw] '>
      <video
      className='w-full h-[56.25vw] object-cover brightness-[60%]'
      src={data?.videoUrl}
      autoPlay
      muted
      loop
      poster={data?.thumbnailUrl} 
    ></video>
    <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16">
        <p className="text-white text-1xl md:text-5xl lg:text-6xl h-full w-[50%] font-bold drop-shadow-xl">
            {data?.title}
        </p>
        <p className='text-white text-[8px] md:text-lg mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%]'>{data?.description}</p>
          <div className="flex flex-row items-center gap-3 mt-3 md:mt-4">
            <PlayButton movieId={data?.id} />
    <button onClick={handleOpenModal} className='bg-white text-white bg-opacity-30 rounded-md py-1 md:py-2 px-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-opacity-20 transition'><AiOutlineInfoCircle className="mr-1" /> More info</button>

    </div>
    </div>
  
    </div>
  )
}

export default Billboard
