// VideoList.js
import React from 'react';
import VideoCard from './VideoCard';
import Navbar from '../Home/Navbar2';

const VideoList = ({ videos }) => {
  return (
    <>
    <div className='videoaline'>
<Navbar/>
      {videos.map((video) => (
        <div className="video-card">
        <VideoCard key={video._id} video={video} />
        </div>
      ))}
    </div>
    </>
  );
};

export default VideoList;
