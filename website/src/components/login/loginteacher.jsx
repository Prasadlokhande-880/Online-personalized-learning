import React, { useState } from 'react';
import './login2.css';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/teacherlogin', {
        username,
        password,
      });

      // Assuming your backend returns a success status
      if (response.status === 200) {
        console.log('Login successful');
        // Handle successful login, e.g., redirect to dashboard
      } else {
        console.error('Login failed');
        // Handle login failure, e.g., display error message
      }
      window.location.href = '/home2';
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className='body'>
    <div className="box-form">
      <div className="left">
        <div className="overlay">
          <h1>Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Curabitur et est sed felis aliquet sollicitudin
          </p>
          <span>
            <a href="/n">
              <i className="fa fa-twitter" aria-hidden="true"></i> Sign up
            </a>
          </span>
        </div>
      </div>

      <div className="right">
        <h5>Login</h5>
        <br/>
        <br/>
        <br/>
        <br/>
        <p>
          Don't have an account? <a href="/n">Create Your Account</a> it takes
        </p>
        <div className="inputs">
            <input
              type="text"
              placeholder="user name"
              value={username}
              onChange={handleUsernameChange}
            />
            <br />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <br />
          <br />

          <div className="remember-me--forget-password">
            <p>Forget password?</p>
          </div>

          <br />
          <button className='logintecher' onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>

  );
};

export default Login;
