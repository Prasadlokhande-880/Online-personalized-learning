import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './launchpad.css';

const Launchpad = () => {
    const [launchpadItems, setLaunchpadItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4200/launchpad');
                setLaunchpadItems(response.data);
                console.log('Data is received from the backend:', response.data);
            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="launchpad">
            <div className="header3">
                <h1>Launchpad Solution Includes</h1>
                <p>We will help you to create a solid job search plan, prepare for the job search process, and execute the plan with confidence.</p>
            </div>
            <div className="launchpad-flex">
                {launchpadItems.map((item, index) => (
                    <div key={index} className={`${item.title.toLowerCase()} launch`}>
                        <h1>{item.title}</h1>
                        <p>{item.description}</p>
                        <a href='Course'><button className="learn">Learn More</button></a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Launchpad;
