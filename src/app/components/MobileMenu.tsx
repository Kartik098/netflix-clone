import React from 'react'
interface MobileMenuProps {
    visible?: boolean;

}
const MobileMenu: React.FC<MobileMenuProps>= ({
    visible
}) => {

    if(!visible){
  return (
   null
  )
    } else {
        return (
             <div className='bg-black w-56 absolute top-8 left-0 py-5 flex-col border-2 border-gray-800 flex'>
      <div className="flex flex-col gap-4 text-white">
        <div className="px-3 text-center hover:underline">
            Home
        </div>
         <div className="px-3 text-center hover:underline">
            Series
        </div>
         <div className="px-3 text-center hover:underline">
            Films
        </div>
         <div className="px-3 text-center hover:underline">
            News & Popular
        </div>
        <div className="px-3 text-center hover:underline">
            My List
        </div>
        <div className="px-3 text-center hover:underline">
            Browse by languages
        </div>
      </div>
    </div>
        )
    }

}

export default MobileMenu
