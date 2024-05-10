import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import Slider from 'react-slick'

import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class TrendingNow extends Component {
  state = {apiStatus: apiStatusConstants.initial, trendingMoviesList: []}

  componentDidMount() {
    this.getAllTrendingMovies()
  }

  getAllTrendingMovies = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const apiurl = 'https://apis.ccbp.in/movies-app/trending-movies'
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiurl, options)

    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.results.map(eachTrendingMovie => ({
        id: eachTrendingMovie.id,
        posterPath: eachTrendingMovie.poster_path,
        title: eachTrendingMovie.title,
        backDropPath: eachTrendingMovie.backdrop_path,
      }))
      this.setState({
        trendingMoviesList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSlider = () => {
    const settings = {
      dots: false,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
      ],
    }
    const {trendingMoviesList} = this.state

    return (
      <Slider {...settings}>
        {trendingMoviesList.map(eachMovie => {
          const {id, title, posterPath} = eachMovie

          return (
            <Link to={`/movies/${id}`} key={id}>
              <img src={posterPath} alt={title} className="movie-image" />
            </Link>
          )
        })}
      </Slider>
    )
  }

  trendingSuccessview = () => {
    return (
      <div className="main-container">
        <div className="slick-container">{this.renderSlider()}</div>
      </div>
    )
  }

  retryTrendingMovies = () => {
    this.getAllTrendingMovies()
  }

  trendingFailureview = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dqdx0yz2t/image/upload/v1713071235/Icon_1_ijcoh1.png"
        alt="failure view"
        className="failure-view"
      />

      <p className="failure-para">Something went wrong. Please try again</p>
      <button className="failure-button" onClick={this.retryTrendingMovies}>
        Try Again
      </button>
    </div>
  )

  trendingLoadingView = () => {
    return (
      <div className="loader-container" testid="loader">
        <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
      </div>
    )
  }

  renderTrendingMovies = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.trendingSuccessview()
      case apiStatusConstants.failure:
        return this.trendingFailureview()
      case apiStatusConstants.inprogress:
        return this.trendingLoadingView()
      default:
        return <h1>NOTHING</h1>
    }
  }

  render() {
    return this.renderTrendingMovies()
  }
}

export default TrendingNow
