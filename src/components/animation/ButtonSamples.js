import React, { Component } from 'react';
class ButtonSamples extends Component {
  constructor() {
    super();
    this.state = {
    };
  };


render() {
  return (
    <div>
      <h1>Animation Buttons</h1>
      <p>Hover us and enjoy the satisfying neumorphic animation designs!</p>
      <div>
        <button className="custom-btn btn-1">Read More</button>
        <button className="custom-btn btn-2">Read More</button>
        <button className="custom-btn btn-3"><span>Read More</span></button>
        <button className="custom-btn btn-4"><span>Read More</span></button>
        <button className="custom-btn btn-5"><span>Read More</span></button>
        <button className="custom-btn btn-6"><span>Read More</span></button>
        <button className="custom-btn btn-7"><span>Read More</span></button>
        <button className="custom-btn btn-8"><span>Read More</span></button>
        <button className="custom-btn btn-9">Read More</button>
        <button className="custom-btn btn-10">Read More</button>
        <button className="custom-btn btn-11">Read More<div className="dot"></div></button>
        <button className="custom-btn btn-12"><span>Click!</span><span>Read More</span></button>
        <button className="custom-btn btn-13">Read More</button>
        <button className="custom-btn btn-14">Read More</button>
        <button className="custom-btn btn-15">Read More</button>
        <button className="custom-btn btn-16">Read More</button>
      </div>

    </div>  
    )
  }
}

export default ButtonSamples;
