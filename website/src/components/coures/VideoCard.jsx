// VideoCard.js
import React from 'react';
import "./VideoCard.css";


function VideoCard({ videoName, videoDescription, characterName, URLimg, URLvideo, id_uploded }) {
    return (
        <div className="videoCard">
            <div className="videoCard_info" >
                <video className="videoCard__thumbnail" controls poster={URLimg}>
                <source src={URLvideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
                <div className="videoCard__text">
                    <h4>{videoName}</h4>
                    <p>{videoDescription}</p>
                    <p>{characterName}</p>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
