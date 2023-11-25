// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoList from './videolist';
import './videos.css';

const App = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get('/getDatevideo');
      const data = response.data;
      setVideos(data);
    } catch (error) {
      console.error('Error fetching data from the backend', error);
    }
  };

  return (
    <div>
      {/* Your other components or layout */}
      <VideoList videos={videos} />
    </div>
  );
};

export default App;
