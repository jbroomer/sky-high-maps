import React from 'react';
import './loading-screen.css'


const Loading = (props) => (
  <div className="loading-screen">
    <div className="loading-screen--text">
      Loading... {props.percent}%
    </div>
  </div>
);

export default Loading;