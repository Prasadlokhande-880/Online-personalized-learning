// CoursesSection.jsx
import React, { useState, useEffect } from 'react';
import './cour.css';
import axios from 'axios';
import './first.css';

const CoursesSection = () => {

    const container = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
          }
        }
      };

      const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1
        }
      };

    const [option, click] = useState('1');
    const [courseData, setCourseData] = useState([]);

    // this is the slide function
    const slide = (n) => {
        click(n);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/Allcourses${option}`);
                setCourseData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [option]);


    return (
        <div>
            <div className="trending-page">
                <div>
                    <h1>Trending Page</h1>
                </div>
                <div className="nav2">
                    <ul className="nav-list2">
                        <li onClick={() => slide('1')} className="list2 hover-underline-animation">
                            All courses
                        </li>
                        <li onClick={() => slide('2')} className="list2 hover-underline-animation">
                            All
                        </li>
                        <li onClick={() => slide('3')} className="list2 hover-underline-animation">
                            product
                        </li>
                        <li onClick={() => slide('4')} className="list2 hover-underline-animation">
                            Marketing
                        </li>
                        <li onClick={() => slide('5')} className="list2 hover-underline-animation">
                            business
                        </li>
                        <li onClick={() => slide('6')} className="list2 hover-underline-animation">
                            leadership
                        </li>
                        <li onClick={() => slide('7')} className="list2 hover-underline-animation">
                            design
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex-block">
                {courseData.map((course, index) => (
                    <div className={course.classname} key={index}>
                        <h2>{course.Title}</h2>
                        <p>{course.Starting}</p>
                        <div className="in-block-flex">
                            <img className="in-block-img" src={course.URL} alt="" />
                            <p className="in-block">
                                <strong>{course.Name}</strong> <br />
                                {course.sub_title}
                            </p>
                        </div>
                        <p>{course.Info}</p>
                        <button className="button view">View Course</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursesSection;
