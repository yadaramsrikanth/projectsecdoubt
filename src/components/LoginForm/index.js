import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import ProfileContext from '../../context/ProfileContext'

import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', onShowError: '', isError: false}

  onSubmitSuccess = jwtToken => {
    const {username, password} = this.state
    localStorage.setItem('username', username)
    localStorage.setItem('password', password)
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({isError: true, onShowError: errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    localStorage
    const userDetails = {
      username,
      password,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, isError, onShowError} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <ProfileContext.Consumer>
        {value => {
          const {updateProfileUserName, updateProfilePassword} = value

          const onChangeUserName = event => {
            this.setState({username: event.target.value})
            updateProfileUserName(event.target.value)
          }

          const onChangePassword = event => {
            this.setState({password: event.target.value})
            updateProfilePassword(event.target.value)
          }
          return (
            <div className="loginFormContainer">
              <img
                src="https://res.cloudinary.com/dqdx0yz2t/image/upload/v1711936595/Group_7399_1_elui8h.png"
                alt="login website logo"
                className="movies-logo"
              />
              <div className="container">
                <form className="login-container" onSubmit={this.onSubmitForm}>
                  <p className="login-heading">Login</p>
                  <label className="label-element" htmlFor="username">
                    USERNAME
                  </label>
                  <input
                    value={username}
                    type="text"
                    id="username"
                    className="input-element"
                    placeholder="USERNAME"
                    onChange={onChangeUserName}
                  />
                  <label className="label-element" htmlFor="password">
                    PASSWORD
                  </label>
                  <input
                    value={password}
                    type="password"
                    id="password"
                    className="input-element"
                    placeholder="password"
                    onChange={onChangePassword}
                  />
                  {isError && <p className="error-msg">{onShowError}</p>}
                  <button type="submit" className="login-button">
                    Login
                  </button>
                </form>
              </div>
            </div>
          )
        }}
      </ProfileContext.Consumer>
    )
  }
}

export default LoginForm
