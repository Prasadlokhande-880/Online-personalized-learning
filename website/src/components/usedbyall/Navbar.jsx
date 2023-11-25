import React from 'react'
import './navbar.css';
import img1 from './firstimg.png';

const Navbar = () => {
  return (
        <div id="first-page" className="page1">
            <div className="heading">
                Work based Learning <br /> platform for student <br /> & employees
            </div>
            <div className="firstimg">
                <img className="img1" src={img1} alt="" />
            </div>
        </div>
  )
}

export default Navbar