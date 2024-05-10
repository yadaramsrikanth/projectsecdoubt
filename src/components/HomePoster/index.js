import './index.css'

const HomePoster = props => {
  const {initialPoster} = props
  const {backdropPath, overview, title} = initialPoster

  return (
    <div
      className="home-poster-container"
      style={{backgroundImage: `url(${backdropPath})`}}
    >
      <h1 className="super-man-heading">{title}</h1>
      <p className="super-man-para">{overview}</p>
      <button type="button" className="play-button">
        Play
      </button>
    </div>
  )
}

export default HomePoster
