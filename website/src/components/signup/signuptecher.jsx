import React, { useState } from 'react';
import './signup.css';
import img1 from './facebook(1).png';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [Experience, setExperience] = useState('');
  const [ContactNumber, setContactNumber] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
  };

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
  };

  const handleContactNumberChange = (e) => {
    setContactNumber(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/teachersignup", {
        name,
        branch,
        Experience,
        ContactNumber,
        Email,
        Password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      window.location.href = '/login';
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  return (
    <div className='signup_mainDiv'>
      <div className='signup_subDiv_inputs'>
        <div className='signup_subDiv_option'>
          <p className='signup_subDiv_heading'>Get Started Now</p>
          <p className='signup_subDiv_subheading'>
            Enter your credentials to access your account
          </p>

          <div className='signup_subDiv_option_button'>
            <button className='signup_subDiv_option_signupBYGoogle'>
              <img src='https://cdn.pixabay.com/photo/2021/05/24/09/15/google-logo-6278331_640.png' alt='Google' />
              Log in with Google
            </button>
            <button className='signup_subDiv_option_signupBYFacebook'>
              <img src={img1} alt='Facebook' />
              Log in with Facebook
            </button>
          </div>
          <hr className='hr-text' data-content='or' />
        </div>

        <div className='signup_subDiv_form'>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor='name'>Name:</label>
              <input
                type='text'
                id='name'
                placeholder='Enter your name'
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div>
              <label htmlFor='branch'>Branch:</label>
              <input
                type='text'
                id='branch'
                placeholder='Enter your branch'
                value={branch}
                onChange={handleBranchChange}
              />
            </div>
            <div>
              <label htmlFor='Experience'>Experience:</label>
              <input
                type='text'
                id='Experience'
                placeholder='Enter your Experience'
                value={Experience}
                onChange={handleExperienceChange}
              />
            </div>
            <div>
              <label htmlFor='ContactNumber'>Contact Number:</label>
              <input
                type='tel'
                id='ContactNumber'
                placeholder='Enter your contact number'
                value={ContactNumber}
                onChange={handleContactNumberChange}
              />
            </div>
            <div>
              <label htmlFor='Email'>Email:</label>
              <input
                type='Email'
                id='Email'
                placeholder='Enter your Email'
                value={Email}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label htmlFor='Password'>Password:</label>
              <input
                type='Password'
                id='Password'
                placeholder='Enter your Password'
                value={Password}
                onChange={handlePasswordChange}
              />
            </div>
            <br/>
            <button type='submit' className='sign_up'>Sign Up</button>
          </form>
        </div>
      </div>

      <div className='signup_subDiv_img'>
        <p className='signup_subDiv_img_heading'>The simplest way to manage your workforce</p>
        <p className='signup_subDiv_img_subheading'>Enter your credentials to access your account</p>

        <div className='signup_subDiv_img_side'>
          <img src='https://static.vecteezy.com/system/resources/previews/005/607/881/original/businessman-he-is-successful-run-to-the-finish-line-the-concept-of-victory-of-success-achieves-the-goals-set-flat-style-cartoon-illustration-vector.jpg' alt='Workforce' />
        </div>
      </div>
    </div>
  );
};

export default Signup;
