import React from 'react'

const Panel = ({children, className}) => (
  <div className={["panel", className].join(' ')}>
    {children}

    <style jsx>{`
      .panel {
        background: #FFFFFF;
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        font-size: 12px;
      }
    `}</style>
  </div>
)

export default Panel
