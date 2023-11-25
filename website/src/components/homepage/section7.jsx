import React from 'react';
import section7 from './section7.css';


const Section7 = () => {
    return (
        <div className="section7">
            <div className="last-column column1">
                <img className="logo2" src="https://wallpapers.com/images/featured-full/john-wick-jeaidqurrfx52d3u.jpg" alt="" />
                <h1>Jumpstart Your <br /> Career Here</h1>
            </div>
            <div className="last-column column2">
                <p>Join our mailing list and learn how to transition students to young professionals</p>
                <div className="email">
                    <input type="email" placeholder="Enter your Email Address" />
                    <input type="submit" value="SUBMIT" />
                </div>
            </div>
            <div className="last-column column3">
                <ul className="last-list">
                    <li className="first"> <strong>Company</strong></li>
                    <li>About us</li>
                    <li>Career</li>
                    <li>Help center </li>
                    <li>Privacy</li>
                </ul>
            </div>
            <hr style={{ color: 'aliceblue' }} className="line" />
        </div>
    );
};

export default Section7;
