import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './codechef.css';
import Navbar from '../Home/Navbar';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    country: '',
    profession: '',
    institution: '',
    teamsList: '',
    teamInvites: '',
    discussProfile: '',
    codeChefProPlan: '',
    isEditMode: false,
    profilePicture: null,
    URL_value: '',
  });

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');

  const uploadImage = async () => {
    try {
      console.log('img');
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', 'zzdxjxts');
      data.append('cloud_name', 'dwzegbafg');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dwzegbafg/image/upload',
        data
      );
      console.log('Image uploaded successfully:', response.data.secure_url);

      setUrl(response.data.secure_url);

      const resw = await axios.post('/uploadimg', {
        username: userData.username,
        url: response.data.secure_url,
      });
      console.log('This is the response:', resw);
      window.location.reload();
    } catch (err) {
      console.error('Error uploading image:', err);
      // Handle the error as required
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get('/getDate');
      const data = response.data;
      setUserData({ ...data });
      console.log(data);
    } catch (error) {
      console.error('Error fetching data from the backend', error);
    }
  };

  const handleEdit = () => {
    setUserData({ ...userData, isEditMode: true });
  };

  const handleSave = async () => {
    try {
      setUserData({ ...userData, isEditMode: false });
      await axios.post('/postFunction', userData);
      setUserData({ ...userData, isEditMode: false });
    } catch (error) {
      console.error('Error uploading profile data', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };


  const handleImageChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  return (
    <>
    <Navbar/>
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="profile.css" />

      <div className="main-content">
        {/* User */}
        <ul className="navbar-nav align-items-center d-none d-md-flex">
          <li className="nav-item dropdown">
            <a
              className="nav-link pr-0"
              href="#"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <div className="media align-items-center">
                <div className="media-body ml-2 d-none d-lg-block"></div>
              </div>
            </a>
            <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-right">
              <div className=" dropdown-header noti-title">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </div>
              <a href="../examples/profile.html" className="dropdown-item">
                <i className="ni ni-single-02"></i>
                <span>My profile</span>
              </a>
              <a href="../examples/profile.html" className="dropdown-item">
                <i className="ni ni-settings-gear-65"></i>
                <span>Settings</span>
              </a>
              <a href="../examples/profile.html" className="dropdown-item">
                <i className="ni ni-calendar-grid-58"></i>
                <span>Activity</span>
              </a>
              <a href="../examples/profile.html" className="dropdown-item">
                <i className="ni ni-support-16"></i>
                <span>Support</span>
              </a>
              <div className="dropdown-divider"></div>
              <a href="#!" className="dropdown-item">
                <i className="ni ni-user-run"></i>
                <span>Logout</span>
              </a>
            </div>
          </li>
        </ul>
      </div>

      {/* Header */}
      <div className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center" style={{ minHeight: '600px', backgroundImage: 'url(https://raw.githubusercontent.com/creativetimofficial/argon-dashboard/gh-pages/assets-old/img/theme/profile-cover.jpg)', backgroundSize: 'cover', backgroundPosition: 'center top' }}>
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8"></span>
        {/* Header container */}
        <div className="container-fluid d-flex align-items-center">
          <div className="row">
            <div className="col-lg-7 col-md-10">
              <h1 className="display-2 text-white">Hello {userData.username}</h1>
              <p className="text-white mt-0 mb-5">This is your profile page. You can see the progress you've made with your work and manage your projects or assigned tasks</p>
              <a href="#!" className="btn btn-info">Edit profile</a>
            </div>
          </div>
        </div>
      </div>

      {/* Page content */}
      return (

    {/* ... (unchanged code) */}

    {/* Page content */}
    <div className="container-fluid mt--7">
        <div className="row">
          <div className="col-xl-4 order-xl-2 mb-5 mb-xl-0">
            <div className="card card-profile shadow">
              <div className="row justify-content-center">
                <div className="col-lg-3 order-lg-2">
                  <div className="profile-picture">
                    <div className="card-profile-image">
                      <img
                        src={
                          userData.URL_value ||
                          'https://demos.creative-tim.com/argon-dashboard/assets-old/img/theme/team-4.jpg'
                        }
                        className="rounded-circle"
                        alt="profile-pic"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4"></div>
              <div className="card-body pt-0 pt-md-4">
                <div className="row">
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5"></div>
                  </div>
                </div>
                <div className="text-center">
                  <h3>
                    {userData.username}
                    <span className="font-weight-light">
                      {userData.age && `, ${userData.age}`}
                    </span>
                  </h3>
                  {userData.isEditMode && (
                      <div>
                        <input

                          type="file"
                          id="avatar"
                          name="avatar"
                          accept="image/png, image/jpeg"
                          onChange={handleImageChange}
                        />
                        <button className='btn btn-sm btn-info' onClick={uploadImage}>Upload</button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-8 order-xl-1">
            <div className="card bg-secondary shadow">
              <div className="card-header bg-white border-0">
                <div className="row align-items-center">
                  <div className="col-8">
                    <h3 className="mb-0">My account</h3>
                  </div>
                  <div className="col-4 text-right">
                    {userData.isEditMode ? (
                      <button
                        onClick={handleSave}
                        className="btn btn-sm btn-success"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={handleEdit}
                        className="btn btn-sm btn-info"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <form>
                  {/* ... (unchanged code) */}
                  <h6 className="heading-small text-muted mb-4">User information</h6>
                  <div className="pl-lg-4">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group focused">
                          <label className="form-control-label" htmlFor="input-username">Username</label>
                          <input
                            type="text"
                            id="input-username"
                            className="form-control form-control-alternative"
                            placeholder="Username"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="form-control-label" htmlFor="input-email">Email address</label>
                          <input
  type="email"
  id="input-email"
  name='email'
  className="form-control form-control-alternative"
  placeholder="jesse@example.com"
  value={userData.email}
  onChange={handleChange}
  disabled={true}
/>

                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group focused">
                          <label className="form-control-label" htmlFor="input-first-name">Institution</label>
                          <input type="text" id="input-first-name" className="form-control form-control-alternative" placeholder="Institution" name='institution' value={userData.institution} onChange={handleChange} disabled={!userData.isEditMode} />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group focused">
                          <label className="form-control-label" htmlFor="input-last-name">Profession</label>
                          <input
                            type="text"
                            id="input-last-name"
                            className="form-control form-control-alternative"
                            placeholder="Profession"
                            name="profession"
                            value={userData.profession}
                            onChange={handleChange}
                            disabled={!userData.isEditMode}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">Contact information</h6>
                  <div className="pl-lg-4">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group focused">
                          <label className="form-control-label" htmlFor="input-address">Discuss Profile</label>
                          <input id="input-address" className="form-control form-control-alternative" placeholder="Discuss Profile" name='discussProfile' value={userData.discussProfile} onChange={handleChange} disabled={!userData.isEditMode} />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="form-group focused">
                          <label className="form-control-label" htmlFor="input-teamsList">Teams List</label>
                          <input type="text" id="input-teamsList" className="form-control form-control-alternative" placeholder="Teams List" name='teamsList' value={userData.teamsList} onChange={handleChange} disabled={!userData.isEditMode} />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="form-group focused">
                          <label className="form-control-label" htmlFor="input-country">Country</label>
                          <input
                            type="text"
                            id="input-country"
                            className="form-control form-control-alternative"
                            placeholder="Country"
                            name="country"
                            value={userData.country}
                            onChange={handleChange}
                            disabled={!userData.isEditMode}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="form-group">
                          <label className="form-control-label" htmlFor="input-team-name">Team Name</label>
                          <input
                            type="text"
                            id="input-team-name"
                            className="form-control form-control-alternative"
                            placeholder="Team Name"
                            name='teamInvites'
                            value={userData.teamInvites}
                            onChange={handleChange}
                            disabled={!userData.isEditMode}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default ProfilePage;
