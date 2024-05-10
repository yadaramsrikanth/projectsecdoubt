import './index.css'

const BackGround = props => {
  const {eachData} = props
  const {adult, title, runTime, releaseDate, overView, posterPath} = eachData
  const hours = Math.floor(runTime / 60)
  const minutes = runTime % 60
  const date = new Date(releaseDate)
  const year = date.getFullYear()
  const adultOrNot = adult ? 'A' : 'U/A'
  return (
    <li className="movie-details-list-item">
      <div
        style={{backgroundImage: `url(${posterPath})`}}
        className="poster-container"
      >
        <div className="poster-description-container">
          <h1 className="title-heading">{title}</h1>
          <div className="duaration-container">
            <p className="duaration-para">{` ${hours}h ${minutes}m`}</p>
            <p className="adult-or-not">{adultOrNot}</p>
            <p className="duaration-para">{year}</p>
          </div>
          <p className="description-para">{overView}</p>
          <button type="button" className="play-button-movie">
            Play
          </button>
        </div>
      </div>
    </li>
  )
}

export default BackGround
