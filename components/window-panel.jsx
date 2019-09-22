import React from 'react'
import Panel from './panel';
import Portal from './portal';

const WindowPanel = ({children, active, onClickOutside}) => <Portal>
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
        height: calc(var(--vh, 1vh) * 100);
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
        max-height: calc(var(--vh, 1vh) * 100 - 40px);
      }
    `}</style>
  </div>
</Portal>

export default WindowPanel