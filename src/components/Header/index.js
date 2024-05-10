import {Component} from 'react'
import {HiOutlineSearch} from 'react-icons/hi'
import {GiHamburgerMenu} from 'react-icons/gi'
import {RiCloseCircleFill} from 'react-icons/ri'
import {Link} from 'react-router-dom'

import './index.css'

class Header extends Component {
  state = {isSearch: false, clickedIcon: false, searchedText: ''}

  sendingFunctionDetails = () => {
    const {callingSearchFunction} = this.props
    const {searchedText} = this.state
    callingSearchFunction(searchedText)
  }

  onChnageSearchText = event => {
    this.setState({searchedText: event.target.value})
    console.log(event.target.value)
  }

  onClickSearchButton = () => {
    this.setState(prevState => ({isSearch: !prevState.isSearch}))
  }

  onClickHamburgerIcon = () => {
    this.setState({clickedIcon: true})
  }

  onClickCloseButton = () => {
    this.setState({clickedIcon: false})
  }

  render() {
    const {isSearch, clickedIcon, searchedText} = this.state

    return (
      <>
        <nav className="large-device-container">
          <Link to="/" className="link-item">
            <img
              src="https://res.cloudinary.com/dqdx0yz2t/image/upload/v1711936595/Group_7399_1_elui8h.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>
          <ul className="unordered-list-items-Header">
            <Link to="/" className="link-item">
              <li className="home">Home</li>
            </Link>
            <Link to="/popular" className="link-item">
              <li className="home">Popular</li>
            </Link>
          </ul>

          <div className="profile-container">
            {isSearch ? (
              <div className="search-container">
                <input
                  type="search"
                  className="search-element"
                  placeholder="search"
                  onChange={this.onChnageSearchText}
                  value={searchedText}
                />
                <button
                  type="button"
                  className="search-button"
                  testid="searchButton"
                  onClick={this.sendingFunctionDetails}
                >
                  <HiOutlineSearch size={18} />
                </button>
              </div>
            ) : (
              <Link to="/search" className="link-item">
                <button
                  className="search-button"
                  testid="searchButton"
                  type="button"
                  onClick={this.onClickSearchButton}
                >
                  <HiOutlineSearch size={20} />
                </button>
              </Link>
            )}
            <Link to="/account" className="link-item">
              <img
                src="https://res.cloudinary.com/dqdx0yz2t/image/upload/v1712026591/Avatar_otadw8.png"
                alt="profile"
                className="profile-image"
              />
            </Link>
          </div>

          <button
            type="button"
            className="hamburger-button"
            onClick={this.onClickHamburgerIcon}
          >
            <GiHamburgerMenu size={35} />
          </button>
        </nav>
        {clickedIcon && (
          <ul className="small-device-below-container">
            <Link to="/" className="link-item">
              <li className="navigate-items">Home</li>
            </Link>
            <Link to="/popular" className="link-item">
              <li className="navigate-items">Popular</li>
            </Link>
            <Link to="/account" className="link-item">
              <li className="navigate-items">Account</li>
            </Link>
            <button
              type="button"
              className="close-button"
              onClick={this.onClickCloseButton}
            >
              <RiCloseCircleFill size={30} />
            </button>
          </ul>
        )}
      </>
    )
  }
}
export default Header
