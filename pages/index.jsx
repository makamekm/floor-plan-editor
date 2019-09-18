import React from 'react'
import Root from '../components/root'
import ThreeScene from '../components/scene'
import CubeView from 'react-cubeview';

import 'react-cubeview/lib/css/react-cubeview.css';

const Page = () => {
  const updateAngles = () => {
    // console.log('Updated');
  };

  return (
    <>
      <ThreeScene className="view"/>
      {/* <div className="cube">
        <CubeView
          onUpdateAngles={updateAngles}
        />
      </div> */}
  
      <style jsx>{`
        .cube {
          position: absolute;
          left: 0;
          top: 0;
          width: 150px;
          height: 150px;
        }
      `}</style>
    </>
  );
};

export default Root(Page);
