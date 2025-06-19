'use client';
import Navbar from "./components/Navbar";
import Billboard from "./components/Billboard";
import MoviesList from "./components/MoviesList";
import useMoviesList from "../../hooks/useMoviesList";
import useFavourites from "../../hooks/useFavourites";
import { useEffect } from "react";
import { checkSessionOrRedirect } from "../../lib/getSession";
import InfoModal from "./components/InfoModal";
import useInfoModal from "../../hooks/useInfoModal";



export default  function Home() {
  const { data: movies = [] } = useMoviesList() 
  const { data: favourites = [] } = useFavourites() 
  const { isOpen, closeModal } = useInfoModal()
  debugger
  useEffect(() => {
          checkSessionOrRedirect();
        }, []);

 
  return (
    <>
    <InfoModal visible={isOpen} onClose={closeModal} />
    <Navbar />
    <Billboard />
    <div className="pb-40">
    <MoviesList title="Trending Now" data={movies} />
    <MoviesList title="My List" data={favourites} />


    </div>
    </>
  );
}