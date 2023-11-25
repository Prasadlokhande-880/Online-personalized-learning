import React from 'react';
import './Demand.css';
import img2 from './laptop.jpg';


const DemandPage = () => {
    return (
        <div className="demand-page">
            <div className="demand-flex">
                <h1 className="text-h">Get the skills you <br /> need for a job that <br /> is in demand</h1>
                <p className="text-p">The modern labor market dictates its own terms. Today, to <br />
                    be a competitive specialist requires more than <br />
                    professional skills</p>
            </div>
            <div className="demand-flex2">
                <div className="last-time">
                    <div className="col leadership2">
                        <h2>Leadership</h2>
                        <p>Fully committed to the success of the company</p>
                    </div>
                    <div className="col responsibility">
                        <h2>Responsibility</h2>
                        <p>Employee on top priority</p>
                    </div>
                    <div className="col flexibility">
                        <h2>Flexibility</h2>
                        <p>Fully committed to the success of the company</p>
                    </div>
                </div>
                <div className="laptop">
                    <img src={img2} width="700px" alt="" />
                </div>
            </div>
        </div>
    );
};

export default DemandPage;
