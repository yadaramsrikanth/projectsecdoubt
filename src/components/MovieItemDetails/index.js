import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Header from '../Header'
import BackGround from '../BackGround'
import PopularMoviesCard from '../PopularMoviesCard'
import SocialMedia from '../SocialMedia'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  inprogress: 'IN_PROGRESS',
}

class MovieItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    moviesDataList: [],
    genresList: [],
    similarmoviesList: [],
    languageList: [],
  }

  componentDidMount() {
    this.getMovieDetails()
  }

  getMovieDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const movieUrl = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const movieResponse = await fetch(movieUrl, options)
    if (movieResponse.ok) {
      const moviesData = await movieResponse.json()
      console.log(moviesData)
      const moviesUpdatedData = [moviesData.movie_details].map(eachMovie => ({
        adult: eachMovie.adult,
        backdropPath: eachMovie.backdrop_path,
        budget: eachMovie.budget,
        id: eachMovie.id,
        overView: eachMovie.overview,
        releaseDate: eachMovie.release_date,
        posterPath: eachMovie.poster_path,
        runTime: eachMovie.runtime,
        title: eachMovie.title,
        voteAverage: eachMovie.vote_average,
        voteCount: eachMovie.vote_count,
      }))
      const genresData = moviesData.movie_details.genres.map(eachgenre => ({
        genreId: eachgenre.id,
        genreName: eachgenre.name,
      }))
      const similarMoviesData = moviesData.movie_details.similar_movies.map(
        eachSimilarMovie => ({
          id: eachSimilarMovie.id,
          title: eachSimilarMovie.title,
          posterPath: eachSimilarMovie.poster_path,
        }),
      )
      const spokenLanguageData = moviesData.movie_details.spoken_languages.map(
        eachSpokenLanguage => ({
          spokenLanguageId: eachSpokenLanguage.id,
          spokenLanguageName: eachSpokenLanguage.english_name,
        }),
      )
      this.setState({
        moviesDataList: moviesUpdatedData,
        genresList: genresData,
        similarmoviesList: similarMoviesData,
        languageList: spokenLanguageData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  movieItemDetailsSuccessView = () => {
    const {moviesDataList, genresList, languageList, similarmoviesList} =
      this.state
    const newMovieDetails = {...moviesDataList[0]}
    const {releaseDate, budget, voteAverage, voteCount} = newMovieDetails
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const date = new Date(releaseDate)
    const monthName = months[date.getMonth()]
    const year = date.getFullYear()
    const day = date.getDate()
    let dateEndingwith
    if (day === 1) {
      dateEndingwith = 'st'
    } else if (day === 2) {
      dateEndingwith = 'nd'
    } else if (day === 3) {
      dateEndingwith = 'rd'
    } else {
      dateEndingwith = 'th'
    }

    console.log(dateEndingwith)

    return (
      <>
        <ul className="background-image-unordered-list">
          {moviesDataList.map(eachData => (
            <BackGround eachData={eachData} key={eachData.id} />
          ))}
        </ul>
        <div className="movie-description-container">
          <ul className="genres-ul-container">
            <h1 className="genres-heading">Genres</h1>
            {genresList.map(each => (
              <p className="genre-item" key={each.genreId}>
                {each.genreName}
              </p>
            ))}
          </ul>
          <ul className="genres-ul-container">
            <h1 className="genres-heading">Audio Available</h1>
            {languageList.map(each => (
              <p className="genre-item" key={each.spokenLanguageId}>
                {each.spokenLanguageName}
              </p>
            ))}
          </ul>
          <div className="rating-and-count-container">
            <h1 className="genres-heading">Rating Count</h1>
            <p className="genre-item">{voteCount}</p>
            <h1 className="genres-heading">Rating Average</h1>
            <p className="genre-item">{voteAverage}</p>
          </div>
          <div className="rating-and-count-container">
            <h1 className="genres-heading">Budget</h1>
            <p className="genre-item">{budget}</p>
            <h1 className="genres-heading">Release Date</h1>
            <p className="genre-item">{`${day}${dateEndingwith} ${monthName} ${year}`}</p>
          </div>
        </div>
        <h1 className="similar-movies-heading">More like this</h1>
        <ul className="similar-movies-ul-container">
          {similarmoviesList.map(each => (
            <PopularMoviesCard eachMovieItem={each} key={each.id} />
          ))}
        </ul>
        <SocialMedia />
      </>
    )
  }

  retryMovieDetails = () => {
    this.getMovieDetails()
  }

  movieItemDetailsFailureView = () => (
    <div className="movieDetailsFailure">
      <img
        src="https://res.cloudinary.com/dqdx0yz2t/image/upload/v1713064112/Background-Complete_1_oywu3z.png"
        alt="failure view"
        className="failure-details-image"
      />
      <p className="movie-failure-para">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="movie-item-failure-button"
        onClick={this.retryMovieDetails}
      >
        Try Again
      </button>
    </div>
  )

  movieItemDetailsLoadingView = () => (
    <div className="movieDetailsLoading" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderMovieItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.movieItemDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.movieItemDetailsFailureView()
      case apiStatusConstants.inprogress:
        return this.movieItemDetailsLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="movie-item-details-main-container">
        <Header />
        <div className="movie-item-details-container">
          {this.renderMovieItemDetails()}
        </div>
      </div>
    )
  }
}

export default MovieItemDetails
