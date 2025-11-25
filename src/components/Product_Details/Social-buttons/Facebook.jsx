import { Link } from 'react-router-dom';
import './facebook.css'

function Facebook({link}) {
  return (
    <a href={link ? link : 'https://www.facebook.com/'} target="_blank" rel="noopener noreferrer">
      <div className="facebookicon">
        <span className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="33"
            viewBox="0 0 512 512"
            height="33"
          >
            <g>
              <path
                fill="#3a5ba2"
                d="m256.23 512c140.58 0 255.77-115.19 255.77-255.77 0-141.046-115.19-256.23-255.77-256.23-141.046 0-256.23 115.184-256.23 256.23 0 140.58 115.184 255.77 256.23 255.77z"
              ></path>
              <path
                fill="#fff"
                d="m224.023 160.085c0-35.372 28.575-63.946 63.938-63.946h48.072v63.946h-32.199c-8.608 0-15.873 7.257-15.873 15.873v32.192h48.072v63.938h-48.072v144.22h-63.938v-144.22h-48.065v-63.938h48.065z"
              ></path>
            </g>
          </svg>
        </span>
        <span className="text1">Follow me</span>
        <span className="text2">1,2k</span>
      </div>
    </a>
  );
}

export default Facebook;
