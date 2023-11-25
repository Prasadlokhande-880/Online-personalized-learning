import React from "react";
import "./contactform.css";
import Navbar from "../Home/Navbar2";

const Contact = () => {
  // const [formData, setFormData] = useState({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   gender: '',
  //   location: '',
  //   message: ''
  // });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value
  //   }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Handle form submission here
  //   console.log(formData);
  //   // Reset form fields
  //   setFormData({
  //     firstName: '',
  //     lastName: '',
  //     email: '',
  //     gender: '',
  //     location: '',
  //     message: ''
  //   });
  // };

  return (
   <><Navbar/>
    <div className="contact_form">
      <div className="contact_form_sideBar">
        <p className="PhysicsSansar">Pawar Sir Academy</p>

        <div className="sub">
          <ul>
            <li className="social_media">
              <a
                href="https://www.facebook.com/quantemjeeacademy/"
                target="_blank"
              >
                <img
                  src={
                    "https://res.cloudinary.com/djo0mmfll/image/upload/v1695846663/PhysicsSansar/facebook_d4wwi6.png"
                  }
                  alt="Facebook Icon"
                  width={"40px"}
                  height={"40px"}
                />
                {/* <p className="links"> @PhysicsSansar</p> */}
              </a>
            </li>
            <li className="social_media">
              <a
                href="https://www.instagram.com/quantemjeeacademy/?hl=en"
                target="_blank"
              >
                <img
                  src={
                    "https://res.cloudinary.com/djo0mmfll/image/upload/v1695846663/PhysicsSansar/instagram_ijct44.png"
                  }
                  alt="Instagram Icon"
                  width={"40px"}
                  height={"40px"}
                />
                {/* <p className="links"> @PhysicsSansar</p> */}
              </a>
            </li>
            <li className="social_media">
              <a
                href="https://www.linkedin.com/company/quantem-jee-academy/about/"
                target="_blank"
              >
                <img
                  src={
                    "https://res.cloudinary.com/djo0mmfll/image/upload/v1695846663/PhysicsSansar/linkedin_ud54um.png"
                  }
                  alt="LinkedIn Icon"
                  width={"40px"}
                  height={"40px"}
                />
                {/* <p className="links">@PhysicsSansar</p> */}
              </a>
            </li>
            <li className="social_media">
              <a target="_blank">
                {/* <p className="links">@PhysicsSansar</p> */}
                <img
                  src={
                    "https://res.cloudinary.com/djo0mmfll/image/upload/v1695846663/PhysicsSansar/twitter_bpfhck.png"
                  }
                  alt="Twitter Icon"
                  width={"40px"}
                  height={"40px"}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="contact_form_mainBar">
        <p className="contact_form_heading">We'd love to help</p>
        <p className="contact_form_subheading">
          Reach out and we'll get in touch within 24 hours.
        </p>

        <div className="input_form">
          <form
            //onSubmit={handleSubmit}
            action="https://formspree.io/f/mjvqdgan"
            method="POST"
          >
            <section className="form_group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                // value={formData.firstName}
                // onChange={handleChange}
                required
              />

              <div className="form_group">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  // value={formData.lastName}
                  // onChange={handleChange}
                  required
                />
              </div>

              <div className="form_group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  // value={formData.email}
                  // onChange={handleChange}
                  required
                />
              </div>

              <label>Gender:</label>
            <div className="radio_options">
              <label htmlFor="male">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  required
                />
                Male
              </label>
              <label htmlFor="female">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  required
                />
                Female
              </label>
              <label htmlFor="other">
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="other"
                  required
                />
                Other
              </label>
            </div>
              <div className="form_group">

                <br></br>
  <label htmlFor="location">Location:</label>
  <select
    id="location"
    name="location"
    // value={formData.location}
    // onChange={handleChange}
    required
  >
    <option value="">Select Location</option>
    <option value="New York">New York</option>
    <option value="Los Angeles">Los Angeles</option>
    <option value="London">London</option>
    <option value="Paris">Paris</option>
    <option value="Tokyo">Tokyo</option>
    <option value="Sydney">Sydney</option>
    <option value="Berlin">Berlin</option>
    <option value="Rome">Rome</option>
    <option value="Dubai">Dubai</option>
    <option value="Toronto">Toronto</option>
    {/* Add more options as needed */}
  </select>
</div>
            </section>

            <div className="form_group_message">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="Enter your message"
                // value={formData.message}
                // onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Contact;