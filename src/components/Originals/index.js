import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import Slider from 'react-slick'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inprogress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Originals extends Component {
  state = {apiStatus: apiStatusConstants.initial, originalMoviesList: []}

  componentDidMount() {
    this.getAllOriginalMovies()
  }

  getAllOriginalMovies = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const originalMoviesUrl = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const originalrespone = await fetch(originalMoviesUrl, options)
    if (originalrespone.ok) {
      const originalMoviesData = await originalrespone.json()
      console.log(originalMoviesData)
      const originalMoviesUpdatedData = originalMoviesData.results.map(
        eachOriginalMovie => ({
          id: eachOriginalMovie.id,
          posterPath: eachOriginalMovie.poster_path,
          title: eachOriginalMovie.title,
        }),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        originalMoviesList: originalMoviesUpdatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderOriginalMoviesSlider = () => {
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
    const {originalMoviesList} = this.state

    return (
      <Slider {...settings}>
        {originalMoviesList.map(eachMovie => {
          const {id, posterPath, title} = eachMovie
          return (
            <Link to={`/movies/${id}`} key={id}>
              <img src={posterPath} alt={title} className="movie-image" />
            </Link>
          )
        })}
      </Slider>
    )
  }

  renderOriginalSuccessView = () => (
    <div className="main-container">
      <div className="slick-container">{this.renderOriginalMoviesSlider()}</div>
    </div>
  )

  retryOriginalMovies = () => this.getAllOriginalMovies()

  renderOriginalFailureView = () => {
    return (
      <div className="failure-container">
        <img
          src="https://res.cloudinary.com/dqdx0yz2t/image/upload/v1713071235/Icon_1_ijcoh1.png"
          alt="failure view"
        />

        <p className="failure-para">Something went wrong. Please try again</p>
        <button className="failure-button" onClick={this.retryOriginalMovies}>
          Try Again
        </button>
      </div>
    )
  }

  renderOriginalLOadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderOriginalMovies = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderOriginalSuccessView()
      case apiStatusConstants.failure:
        return this.renderOriginalFailureView()
      case apiStatusConstants.inprogress:
        return this.renderOriginalLOadingView()
      default:
        return <h1>Originals</h1>
    }
  }

  render() {
    return this.renderOriginalMovies()
  }
}

export default Originals
