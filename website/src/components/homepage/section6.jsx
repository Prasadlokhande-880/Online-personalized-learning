import React from 'react';
import './section6.css';


const Section6 = () => {
    return (
        <div className="section6">
            <h1>Hear From Our Real <br /> Learn Online Customer</h1>
            {/* "learn" is class for "container" and "customer" is class of block */}
            <div className="online">
                <div className="person background">
                    {/* <img className="person-1" src="https://wallpapers.com/images/featured-full/john-wick-jeaidqurrfx52d3u.jpg" alt="" /> */}
                </div>
                {/* INFORMATION */}
                <div className="person paragraph">
                    <p>"One of my biggest concerns has to do with our <br />
                        online classes being able to provide students with <br />
                        real-life, hands-on learning experiences. So, when I <br />
                        looked at Learn Online, it was very exciting for me, <br />
                        because it's a way for our classes and students to <br />
                        connect with thousands of businesses, nonprofits <br />
                        and government agencies. <br />
                    </p>
                    <p>
                        {/* person name */}
                        <section className="name">
                            <strong>Craig Herwitz</strong>  <br />
                            Vice Provost For Strategic Programming <br />
                            University Of North Dakota <br />
                        </section>
                    </p>
                </div>
            </div>
            <img className="person-1" src="https://wallpapers.com/images/featured-full/john-wick-jeaidqurrfx52d3u.jpg" alt="" />
        </div>
    );
};

export default Section6;
