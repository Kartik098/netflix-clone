import React, { useMemo, useCallback } from 'react'
import axios from 'axios'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useFavourites from '../../../hooks/useFavourites'
import { AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai'
interface FavouriteButtonProps {
    movieId: string
}
const FavouriteButton: React.FC<FavouriteButtonProps> = ({movieId}) => {
    const { mutate: mutateFavorites } = useFavourites()
    const { data: currentUser, mutate } = useCurrentUser()

    const isFavorite = useMemo(()=>{
        const list = currentUser?.favoriteIds || [];

        return list.includes(movieId)
    },[currentUser, movieId]);

    const toggleFavorites = useCallback(async ()=>{
        let response;

        if(isFavorite){
            response = await axios.delete('/api/favorite', {
                data : { movieId }  
            })    
        } else {
            response = await axios.post('/api/favorite', { movieId })  
        }
        const updatedFavoriteIds = response?.data?.favoriteIds
        mutate({
            ...currentUser, favoriteIds:updatedFavoriteIds
        })
        mutateFavorites()
    },[movieId, isFavorite, currentUser, mutate, mutateFavorites])

    const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus
  return (
                   <div onClick={toggleFavorites} className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300">
                    <Icon className='text-white' size={25  } />
    </div>
  )
}

export default FavouriteButton
