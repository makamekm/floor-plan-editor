import React from 'react'
import Root from '../components/root'
import ThreeScene from '../components/scene'
import BlueprintView from '../components/blueprint';

const Page = () => {
  return (
    <>
      <div className="view">
        <BlueprintView/>
      </div>
  
      <style jsx>{`
        .view {
          width: 100vw;
          height: 100vh;
        }
      `}</style>
    </>
  );
};

export default Root(Page);
