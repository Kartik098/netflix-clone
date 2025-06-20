import React from 'react';
import { isEmpty } from 'lodash';
import MovieCard from './MovieCard';

interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  // add any other properties your MovieCard expects
}

interface MoviesListProps {
  data: Movie[];
  title: string;
}

const MoviesList: React.FC<MoviesListProps> = ({ data, title }) => {
  if (isEmpty(data)) {
    return null;
  }

  return (
    <div className='px-4 md:px-12 mt-4 space-y-8'>
      <div>
        <p className='text-white text-md md:text-xl lg:text-2xl font-semibold mb-4'>
          {title}
        </p>
      </div>
      <div className='grid grid-cols-4 gap-2'>
        {data.map((movie) => (
          <MovieCard key={movie.id} data={movie} />
        ))}
      </div>
    </div>
  );
};

export default MoviesList;
