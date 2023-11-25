// VideoCard.js
import React from 'react';


const VideoCard = ({ video }) => {
  return (
    <>
        <div className='video-content'>
    <video className='thumbnail' controls poster={video.URLimg}>
  <source src={video.URLvideo} type="video/mp4" />
</video>

      <h2 className='videoname'>{video.videoName}</h2>
      <p className='video-description'>{video.videoDescription}</p>
      <div className='video-info'>
        <div className="video-price">
          <p>{video.characterName}</p>
        </div>
      </div>
      <div className='video-creator'>
        {video.characterName}
      </div>
    </div>
    </>

  );
};

export default VideoCard;
