import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import axios from 'axios'; // Import Axios
import './VideoCard.css';
import Navbar from '../Home/Navbar2';

function App() {
    const [videoData, setVideoData] = useState([]);

    useEffect(() => {

        axios.get('courses')
            .then(response => {
                setVideoData(response.data); // Set fetched data to state
            })
            .catch(error => {
                console.error('Error fetching video data:', error);
            });
    }, []);

    return (
        <>
    <Navbar/>
        <div className="App">
            {videoData.map((video, index) => (
                <VideoCard key={index} {...video} />
            ))}
        </div>
        </>
    );
}

export default App;
