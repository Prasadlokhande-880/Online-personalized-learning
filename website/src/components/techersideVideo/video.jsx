import React, { useRef, useState } from "react";
import axios from "axios";
import './video.css'
import Navbar from "../Home/Navbar2";


export default function VideoInput() {
  const inputRef = useRef();
  const [video, setVideo] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [image, setImage] = useState(null);

  // New state for inputs
  const [videoName, setVideoName] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [URLimg, setUrlimg] = useState('');
  const [URLvideo, setVideourl] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setVideo(file);
  };

  const handleChoose = () => {
    inputRef.current.click();
  };

  const handleUpload = async () => {
    try {
      console.log("Uploading the file");

      const data = new FormData();
      data.append("file", video);
      data.append("upload_preset", "zzdxjxts");
      data.append("cloud_name", "dwzegbafg");

      // Additional data to be sent along with the file
      data.append("videoName", videoName);
      data.append("videoDescription", videoDescription);
      data.append("characterName", characterName);

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dwzegbafg/video/upload",
        data,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadPercentage(progress);
          },
        }
      );

      setVideourl(response.data.secure_url);

      console.log("Video uploaded successfully:", response.data.secure_url);
      console.log("this is the video", URLvideo);
    } catch (err) {
      console.error("Error uploading video:", err);
      // Handle the error as required
    }
  };

  const uploadImage = async () => {
    try {
      console.log('img');
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', 'zzdxjxts');
      data.append('cloud_name', 'dwzegbafg');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dwzegbafg/image/upload',
        data
      );

      setUrlimg(response.data.secure_url);

      console.log("this is the Url:", URLimg);
      console.log('Image uploaded successfully:', response.data.secure_url);
      console.log('This is the response:');
    } catch (err) {
      console.error('Error uploading image:', err);
      // Handle the error as required
    }
  };

  const handleImageChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to your backend API
      const response = await axios.post("videouploding", {
        videoName,
        videoDescription,
        characterName,
        URLimg,
        URLvideo,
      });

      console.log("Form submitted successfully", response.data);
      // Reset the form or redirect the user as needed
      // For example, you can reset the form by clearing the state
      setVideo(null);
      setUploadPercentage(0);
      setImage(null);
      setVideoName("");
      setVideoDescription("");
      setCharacterName("");
      setUrlimg("");
      setVideourl("");

    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle the error, show a message to the user, etc.
    }
  };

  return (
    <>
    <Navbar/>
        <div className="VideoInput">
        {/* Video name input */}
        <label htmlFor="videoName">Video Name:</label>
        <input
          id="videoName"
          type="text"
          placeholder="Enter Video Name"
          value={videoName}
          onChange={(e) => setVideoName(e.target.value)}
        />

        {/* Video description input */}
        <label htmlFor="videoDescription">Video Description:</label>
        <textarea
          id="videoDescription"
          placeholder="Enter Video Description"
          value={videoDescription}
          onChange={(e) => setVideoDescription(e.target.value)}
        />

        {/* Character name input */}
        <label htmlFor="characterName">Character Name:</label>
        <input
          id="characterName"
          type="text"
          placeholder="Enter Character Name"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
        />

        <div>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />
          <button className='btn btn-sm btn-info' onClick={uploadImage}>Upload Image</button>
        </div>

        {/* File input for the video */}
        <label htmlFor="videoFile">Video File:</label>
        <input
          id="videoFile"
          ref={inputRef}
          className="VideoInput_input"
          type="file"
          onChange={handleFileChange}
          accept=".mov,.mp4"
        />
        {!video && <button onClick={handleChoose}>Choose</button>}
        {video && (
          <>
            <video
              className="VideoInput_video"
              width="50%"
              height="250px"
              controls
              src={URL.createObjectURL(video)}
            />
            <div>
              <button onClick={handleUpload}>Upload Video</button>
              {uploadPercentage > 0 && (
                <div>
                  <progress value={uploadPercentage} max="100" />
                  <p>{uploadPercentage}% Uploaded</p>
                </div>
              )}
            </div>
          </>
        )}
        <div className="VideoInput_footer">{video ? "Video selected" : "Nothing selected"}</div>

        <button type="submit" onClick={handleSubmit}>Submit</button>
    </div>
    </>

  );
}
