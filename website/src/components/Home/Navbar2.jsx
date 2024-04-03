import { useState, useEffect } from "react";
import img from './bird-colorful-gradient-design-vector_1023160-95.png'
import "./Homescreen/index2.css"

function Navbar() {
  const [navActive, setNavActive] = useState(false);

  const toggleNav = () => {
    setNavActive(!navActive);
  };

  const closeMenu = () => {
    setNavActive(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 500) {
        closeMenu(); // Corrected: Added parentheses to call the function
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 1200) {
      closeMenu(); // Corrected: Added parentheses to call the function
    }
  }, []);

  return (
    <nav className={`navbar ${navActive ? "active" : ""}`}>
      <div >
        <img className='logoimg' src={img} alt="Logoipsum" />
      </div>
      <a
        className={`nav__hamburger ${navActive ? "active" : ""}`}
        onClick={toggleNav}
      >
        <span className="nav__hamburger__line"></span>
        <span className="nav__hamburger__line"></span>
        <span className="nav__hamburger__line"></span>
      </a>
      <div className={`navbar--items ${navActive ? "active" : ""}`}>
        <ul>
          <li>
            <a
              href="/home2"
            >
              Home
            </a>
          </li>
          <li>
            <a
            href="/profiletecher"
            >
              Portfolio
            </a>
          </li>
          <li>
            <a href='/cont2'>
              Contact me
            </a>
          </li>
          <li>
            <a
              href='/video'>
              Video's
            </a>
          </li>
        </ul>
      </div>
      <a
        onClick={closeMenu}
        activeClass="navbar--active-content"
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
        to="Contact"
        className="btn btn-outline-primary"
        href="/techerlogin"
      >
        Login
      </a>
    </nav>
  );
}

export default Navbar;
