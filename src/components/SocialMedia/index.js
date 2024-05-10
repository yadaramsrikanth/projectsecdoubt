import {FaGoogle} from 'react-icons/fa'
import {FaTwitter} from 'react-icons/fa'
import {FaInstagram} from 'react-icons/fa'
import {FaYoutube} from 'react-icons/fa'
import './index.css'

const SocialMedia = () => (
  <div className="social-media-container">
    <div className="apps-container">
      <FaGoogle className="icons" />
      <FaTwitter className="icons" />
      <FaInstagram className="icons" />
      <FaYoutube className="icons" />
    </div>
    <p className="contact-us">Contact Us</p>
  </div>
)

export default SocialMedia
