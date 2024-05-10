import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Header from '../Header'
import PopularMoviesCard from '../PopularMoviesCard'
import SocialMedia from '../SocialMedia'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
}

class Popular extends Component {
  state = {apiStatus: apiStatusConstants.initial, popularMoviesList: []}

  componentDidMount() {
    this.getAllPopularMovies()
  }

  getAllPopularMovies = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const popularUrl = 'https://apis.ccbp.in/movies-app/popular-movies'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const popularResponse = await fetch(popularUrl, options)
    if (popularResponse.ok) {
      const popularResponseData = await popularResponse.json()
      const popularMoviesUpdatedData = popularResponseData.results.map(
        eachPopularMovie => ({
          id: eachPopularMovie.id,
          title: eachPopularMovie.title,
          posterPath: eachPopularMovie.poster_path,
        }),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        popularMoviesList: popularMoviesUpdatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderPopularSuccessView = () => {
    const {popularMoviesList} = this.state
    return (
      <div className="popular-movies-success-container">
        <ul className="unordered-popular-movies">
          {popularMoviesList.map(eachMovieItem => (
            <PopularMoviesCard
              eachMovieItem={eachMovieItem}
              key={eachMovieItem.id}
            />
          ))}
        </ul>
        <SocialMedia />
      </div>
    )
  }

  retryPopularMovies = () => {
    this.getAllPopularMovies()
  }

  renderPopularFailureView = () => (
    <div className="Popular-failure-container">
      <img
        src="https://res.cloudinary.com/dqdx0yz2t/image/upload/v1713064112/Background-Complete_1_oywu3z.png"
        alt="failure view"
        className="popular-not-found-image"
      />
      <p className="popular-not-found-text">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="popular-button"
        onClick={this.retryPopularMovies}
      >
        Try Again
      </button>
    </div>
  )

  renderPopularLoadingView = () => {
    return (
      <div className="popular-loading-container" testid="loader">
        <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
      </div>
    )
  }

  renderPopularMovies = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPopularSuccessView()
      case apiStatusConstants.failure:
        return this.renderPopularFailureView()
      case apiStatusConstants.inProgress:
        return this.renderPopularLoadingView()
      default:
        return <p>POPULAR'</p>
    }
  }

  render() {
    return (
      <div className="popular-bg-main-container">
        <Header />
        <div className="popular-bg-container">{this.renderPopularMovies()}</div>
      </div>
    )
  }
}

export default Popular
