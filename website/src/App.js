import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Signuppage from "./page/signup";
import Profilepagetecher from "./components/profile/techerprofile";
import Signup from "./components/signup/signuptecher";
import Loginpage from "./page/login";
import Techerlogin from "./components/login/loginteacher";
import Home from "./page/home";
import Profile from "./components/profile/profile";
import Loginpre from "./components/usedbyall/loginpre";
import VideoUploadComponent from "./components/techersideVideo/video";
import Videos from "./components/videos/videos";
import Coures from "./components/coures/coures";
import Home2 from "./components/Home/Homescreen/index";
import Coures2 from "./components/coures/coures";
import Contact from "./components/contactform/cont";
import Contact2 from "./components/contactform/cont2";

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cont2" element={<Contact2 />} />
        <Route path="/signup" element={<Signuppage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/video" element={<VideoUploadComponent />} />
        <Route path="/" element={<Loginpre />} />
        <Route path="/n" element={<Signup />} />
        <Route path="/techerlogin" element={<Techerlogin />} />
        <Route path="/profiletecher" element={<Profilepagetecher />} />
        <Route path="/course" element={<Coures2 />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/CSS" element={<Coures />} />
        <Route path="/home2" element={<Home2 />} />
      </Routes>
    </>
  );
}

export default App;
