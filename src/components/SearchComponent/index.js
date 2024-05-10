import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import PopularMoviesCard from '../PopularMoviesCard'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class SearchComponent extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    searchText: '',
    searchResultsList: [],
  }

  componentDidMount() {
    this.getSearchResults()
  }
  getSearchResults = async () => {
    this.setState({apiStatus: apiStatusConstants.progress})
    const {searchText} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const searchurl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchText}`
    const searchOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(searchurl, searchOptions)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.results.map(eachSearchMovie => ({
        id: eachSearchMovie.id,
        title: eachSearchMovie.title,
        posterPath: eachSearchMovie.poster_path,
      }))
      this.setState({
        searchResultsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  callingSearchFunction = searchedText => {
    this.setState({searchText: searchedText}, this.getSearchResults)
  }

  renderresultsView = () => {
    const {searchResultsList, searchText} = this.state
    const listLength = searchResultsList.length > 0
    console.log(listLength)
    console.log(searchResultsList.length)
    return (
      <div className="results-view-container">
        {listLength ? (
          <ul className="unordered-search-container">
            {searchResultsList.map(eachMovieItem => (
              <PopularMoviesCard
                eachMovieItem={eachMovieItem}
                key={eachMovieItem.id}
              />
            ))}
          </ul>
        ) : (
          <div className="no-items-container">
            <img
              src="https://res.cloudinary.com/dqdx0yz2t/image/upload/v1713363714/Group_7394_xqzzbw.png"
              alt="no movies"
              className="no-movies-image"
            />
            <p className="no-list-length-para">
              Your search for {searchText} did not find any matches
            </p>
          </div>
        )}
      </div>
    )
  }

  searchResultsSuccessView = () => {
    const {searchText} = this.state
    const isEmpty = searchText === ''
    return <div>{isEmpty ? null : <div> {this.renderresultsView()} </div>}</div>
  }

  retrySearchResults = () => {
    this.getSearchResults()
  }

  searchResultsFailureView = () => (
    <div className="search-failure-container">
      <img
        src="https://res.cloudinary.com/dqdx0yz2t/image/upload/v1713064112/Background-Complete_1_oywu3z.png"
        alt="failure view"
        className="search-not-found-image"
      />
      <h1 className="search-not-found-text">
        Something went wrong. Please try again
      </h1>
      <button
        className="search-failure-button"
        type="button"
        onClick={this.retrySearchResults}
      >
        Try Again
      </button>
    </div>
  )
  searchResultsLoadingView = () => (
    <div className="search-loading-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderSearchResults = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.searchResultsSuccessView()
      case apiStatusConstants.failure:
        return this.searchResultsFailureView()
      case apiStatusConstants.progress:
        return this.searchResultsLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="search-main-bg-container">
        <Header callingSearchFunction={this.callingSearchFunction} />
        <div className="search-bg-container">{this.renderSearchResults()}</div>
      </div>
    )
  }
}

export default SearchComponent
