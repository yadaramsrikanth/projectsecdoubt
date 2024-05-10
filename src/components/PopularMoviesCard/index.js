import {Link} from 'react-router-dom'

import './index.css'

const PopularMoviesCard = props => {
  const {eachMovieItem} = props
  const {id, title, posterPath} = eachMovieItem
  return (
    <Link to={`/movies/${id}`}>
      <li className="movie-list-item">
        <img src={posterPath} alt={title} className="movie-card" />
      </li>
    </Link>
  )
}

export default PopularMoviesCard
