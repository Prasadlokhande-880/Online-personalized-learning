import React from 'react';
import './loginpre.css'; // Make sure to import your CSS file
import img1 from './log.svg';

const SignInSignUp = () => {
  return (
    <div className="custom-container">
      <div className="custom-forms-container">
        <div className="custom-signin-signup">
          <form action="" className="custom-sign-in-form">
            <h2 className="custom-title">Account Select</h2>
            <button type="submit" className="custom-btn solid">
              <a href='./login' style={{ color: 'white' }}> Student</a>
            </button>
            <button type="submit" className="custom-btn solid">
            <a href='./techerlogin' style={{ color: 'white' }}>Teacher</a>
</button>
          </form>
        </div>
      </div>
      <div className="custom-panels-container">
        <div className="custom-panel custom-left-panel">
          <div className="custom-content">
            {/* Add your content here */}
            <p></p>
          </div>
          <img src={img1} className="custom-image" alt="" />
        </div>

        <div className="custom-panel custom-right-panel">
          <div className="custom-content">
            <h3>One of us?</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio minus natus est.</p>
            <button className="custom-btn transparent" id="custom-sign-in-btn">
              Sign In
            </button>
          </div>
          <img src="./img/register.svg" className="custom-image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
