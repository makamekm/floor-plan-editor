import React, { memo } from 'react'

const Loading = ({ active }: {
  active: boolean;
}) => (
  <div className={"loading" + (active ? " is-active" : "")}>
    <div className="spinner">
      <div></div><div></div><div></div><div></div>
    </div>
    <style jsx>{`
      .loading {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        pointer-events: none;
        z-index: 999;
        opacity: 0;
        transition: opacity 0.2s:
      }

      .loading.is-active {
        pointer-events: all;
        opacity: 1;
      }

      .spinner {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        display: inline-block;
        position: relative;
        width: 64px;
        height: 64px;
      }

      .spinner div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 51px;
        height: 51px;
        margin: 6px;
        border: 6px solid #fff;
        border-radius: 50%;
        animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #fff transparent transparent transparent;
      }

      .spinner div:nth-child(1) {
        animation-delay: -0.45s;
      }

      .spinner div:nth-child(2) {
        animation-delay: -0.3s;
      }

      .spinner div:nth-child(3) {
        animation-delay: -0.15s;
      }

      @keyframes spinner {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      
    `}</style>
  </div>
)

export default memo(Loading)