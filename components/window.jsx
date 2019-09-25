import React from 'react'
import Portal from './portal';

const Window = ({children, active, onClickOutside}) => <Portal>
  <div
    className={"window" + (active ? " is-open" : "")}
    onClick={(e) => onClickOutside && onClickOutside(e)}>

    <div className="content" onClick={e => e.stopPropagation()}>
      {children}
    </div>

    <style jsx>{`
      .window {
        display: none;
        position: fixed;
        left: 0px;
        top: 0px;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: calc(var(--vh, 1vh) * 100);
        background-color: rgba(0, 0, 0, 0.4);
        pointer-events: none;
        z-index: 100;
        opacity: 0;
        transition: opacity 0.2s;
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
        max-height: calc(var(--vh, 1vh) * 100 - 40px);
        width: calc(100vw - 20px);
        max-width: 400px;
      }
    `}</style>
  </div>
</Portal>

export default Window