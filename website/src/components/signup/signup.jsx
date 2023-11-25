import React, { useState } from 'react';
import './signup.css';
import img1 from './facebook(1).png';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => { // Added "async" keyword here
    e.preventDefault();
    try {
      const response = await fetch("/signup_saving", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      window.location.href = '/login';
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className='signup_mainDiv'>
      {/* this is the div for the input from the user */}
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

      {/* this is the code for the form */}
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
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              placeholder='Enter your email'
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div>
            <label htmlFor='phone'>Phone Number:</label>
            <input
              type='tel'
              id='phone'
              placeholder='Enter your phone number'
              value={phone}
              onChange={handlePhoneChange}
            />
          </div>
          <div>
            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              placeholder='Enter your password'
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <br/>
          <button type='submit' className='sign_up'>Sign Up</button>
        </form>
      </div>
      </div>
      {/* this is the second div for the img and info */}
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
