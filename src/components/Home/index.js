import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import HomePoster from '../HomePoster'
import Header from '../Header'
import SocialMedia from '../SocialMedia'
import TrendingNow from '../TrendingNow'
import Originals from '../Originals'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {apiStatus: apiStatusConstants.initial, initialPoster: {}}

  componentDidMount() {
    this.getHomePosterPage()
  }

  getHomePosterPage = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const randomurl = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(randomurl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const fetchedDataLength = fetchedData.results.length
      const randomPoster =
        fetchedData.results[Math.floor(Math.random() * fetchedDataLength)]
      const updatedData = {
        id: randomPoster.id,
        backdropPath: randomPoster.backdrop_path,
        overview: randomPoster.overview,
        posterPath: randomPoster.poster_path,
        title: randomPoster.title,
      }
      this.setState({
        initialPoster: {...updatedData},
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderHomePosterSuccessView = () => {
    const {initialPoster} = this.state
    return <HomePoster initialPoster={initialPoster} key={initialPoster.id} />
  }

  renderHomePosterLoadingView = () => (
    <div className="loader-container-home" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  getRandomHomePage = () => this.getHomePosterPage()

  renderHomePosterFailureView = () => (
    <div className="failure-container-home">
      <img
        src="https://res.cloudinary.com/dqdx0yz2t/image/upload/v1713071235/Icon_1_ijcoh1.png"
        alt="failure view"
      />

      <p className="failure-para">Something went wrong. Please try again</p>
      <button className="failure-button" onClick={this.getRandomHomePage}>
        Try Again
      </button>
    </div>
  )

  renderHomePoster = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderHomePosterSuccessView()
      case apiStatusConstants.failure:
        return this.renderHomePosterFailureView()
      case apiStatusConstants.inProgress:
        return this.renderHomePosterLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="header-home-container">
        <Header />
        <div className="home-container">{this.renderHomePoster()}</div>
        <div className="response-container">
          <h1 className="topic">Trending Now</h1>
          <TrendingNow />
          <h1 className="topic">Originals</h1>
          <Originals />
        </div>
        <SocialMedia />
      </div>
    )
  }
}

export default Home
