import React from 'react'
import ReactDOM from 'react-dom'
import Panel from './panel';

const WindowPanel = ({children, active, onClickOutside}) => {
  if (process.browser) {
    return active ? ReactDOM.createPortal(
      <div
        className={"window" + (active ? " is-open" : "")}
        onClick={(e) => onClickOutside && onClickOutside(e)}>
        <div className="content" onClick={e => e.stopPropagation()}>
          <Panel>
            <div className="overflow">
              {children}
            </div>
          </Panel>
        </div>
    
        <style jsx>{`
          .window {
            position: fixed;
            left: 0px;
            top: 0px;
            right: 0;
            bottom: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.4);
            pointer-events: none;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.2s:
            display: none;
          }
    
          .window.is-open {
            display: block;
            pointer-events: all;
            opacity: 1;
          }
    
          .content {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
          }
    
          .overflow {
            overflow: auto;
            max-height: calc(100vh - 40px);
          }
        `}</style>
      </div>,
      document.body,
    ) : null;
  } else {
    return null;
  }
}

export default WindowPanel